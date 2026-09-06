import { useEffect, useState } from "react";
import { useTheme } from "../context/Theme";
import All_Post_Section from "../All_Post_Section";
import { usePost } from "../context/PostContext";
import { categories } from "../StanderdThings/StanderdData";
import { Rank_Calculation } from "../context/PostContext";
import StatusPage from "./StatusPage";
import { useQuote } from "../context/QueotrContext";
import SuggetionSlip from "./NewUserUpdate";
import { Loading } from "../../TinyComponent/LazyLoading";

import CanvasVibeEditor from "./CanvasEditor";

const PostLoading = () => {
  const { post_loading } = usePost();
  const { textSecondary } = useTheme();
  const { Errors } = useQuote();

  return Errors ? (
    <div
      className="fs-3 text-danger p-2 d-flex justify-content-center align-items-center"
      style={{ height: "64vh" }}>
      {Errors.message} . . .Try again later or refresh the page!
    </div>
  ) : (
    <div
      className="d-flex justify-content-center  mb-5 align-items-end"
      style={{ height: "20vh" }}>
      {post_loading ? (
        <div className="p-3">
          <Loading dm={34} />
        </div>
      ) : (
        <p className="p-3 text-center" style={{ color: textSecondary }}>
          Not available any more vibe at this time : Try again or refresh
        </p>
      )}
    </div>
  );
};

const Tab = ({ category, Key }) => {
  const { bgSurface, textPrimary } = useTheme();

  const TabStyle = {
    border: `1px solid ${bgSurface}`,
    color: Key === category ? bgSurface : textPrimary,
    minWidth: "max-content",
    background: Key === category ? textPrimary : bgSurface,
  };

  return (
    <>
      <div className="px-3 py-1 rounded w-100" style={{ ...TabStyle }}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </div>
    </>
  );
};

export const VibeTabs = () => {
  const { limit, page, fetch_n_posts, setPosts } = usePost();
  const { bgPage } = useTheme();
  const [loading, setLoading] = useState(true);
  const [Key, setKey] = useState("all");
  const { mobile_break_point, sm_break_point, lgbreakPoint, isNavCollapsed } =
    useQuote();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const res = await fetch_n_posts(limit, 0, Key);
      const sorted = res
        ?.map((post) => ({
          ...post,
          rank: Rank_Calculation(post),
        }))
        .sort((a, b) => b.rank - a.rank);

      setPosts(sorted);
      console.log("page:", page, res);
      setLoading(false);
    })();
  }, [Key]);

  const TabStyle = {
    fontSize: "16px",
    zIndex: 10,
    top: "54px",
    left: `${mobile_break_point ? "0px" : isNavCollapsed ? "74px" : "244px"}`,
    right: "0px",
    width: `${
      mobile_break_point
        ? "100%"
        : isNavCollapsed
          ? "calc(100% - 74px)"
          : "calc(100% - 244px)"
    }`,
    cursor: "pointer",
    background: bgPage,
    transition:
      "left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <>
      <div
        className="vibeTabs position-relative"
        style={{
          marginTop: "116px",
        }}>
        <div
          className="p-2 position-fixed overflow-auto none-scroller d-flex gap-2"
          style={{ ...TabStyle }}>
          {categories.map(({ key, title }) => (
            <div key={title} onClick={() => setKey(key)}>
              <Tab category={key} Key={Key} />
            </div>
          ))}
        </div>

        <div className="d-flex flex-column gap-3 w-100 overflow-hidden">
          <div
            className={`d-flex gap-3 py-2 justify-content-${
              lgbreakPoint || sm_break_point ? "evenly" : "center"
            }`}>
            <div
              className="d-flex flex-column w-100"
              style={{
                maxWidth: isNavCollapsed
                  ? "min(680px, 100%)"
                  : "min(521px, 100%)",
                transition: "max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>
              <StatusPage />

              {categories.map(
                ({ key, title }) =>
                  Key === key && (
                    <div key={title} className="d-flex flex-column gap-4">
                      <All_Post_Section loading={loading} category={key} />
                    </div>
                  ),
              )}

              <PostLoading />
            </div>
            {/* {lgbreakPoint && <SuggetionSlip />} */}
          </div>
        </div>
      </div>
    </>
  );
};
