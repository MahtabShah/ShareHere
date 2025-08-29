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

const PostLoading = () => {
  const { post_loading } = usePost();
  const { text_clrM } = useTheme();
  const { Errors } = useQuote();

  return Errors ? (
    <div
      className="fs-3 text-danger p-2 d-flex justify-content-center align-items-center"
      style={{ height: "64vh" }}
    >
      {Errors.message} . . .Try again later or refresh the page!
    </div>
  ) : (
    <div
      className="d-flex justify-content-center align-items-end"
      style={{ height: "20vh" }}
    >
      {post_loading ? (
        <div className="p-3">
          <Loading dm={34} />
        </div>
      ) : (
        <p className="p-3 text-center" style={{ color: text_clrM }}>
          Not available any more vibe at this time : Try again or refresh
        </p>
      )}
    </div>
  );
};

const Tab = ({ category, Key }) => {
  const { bg1, bg2, bg3, text_clrH, text_clrM, text_clrL } = useTheme();

  const TabStyle = {
    border: `1px solid ${bg1}`,
    color: Key === category ? bg1 : text_clrH,
    minWidth: "max-content",
    background: Key === category ? text_clrH : bg1,
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
  const { bg1, bg2, bg3, text_clrH, text_clrM, text_clrL } = useTheme();
  const [loading, setLoading] = useState(true);
  const [Key, setKey] = useState("all");
  const { mobile_break_point, sm_break_point, lgbreakPoint } = useQuote();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const res = await fetch_n_posts(limit, 0, Key);
      const sorted = res
        .map((post) => ({
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
    zIndex: 1000,
    left: `${mobile_break_point ? "0px" : sm_break_point ? "78px" : "248px"}`,
    right: `0px`,
    cursor: "pointer",
    background: bg2,
  };

  return (
    <>
      <div className="vibeTabs position-relative mt-5 h-100">
        <div
          className="p-2 position-fixed overflow-auto none-scroller d-flex gap-2"
          style={{ ...TabStyle }}
        >
          {categories.map(({ key, title }) => (
            <div key={title} onClick={() => setKey(key)}>
              <Tab category={key} Key={Key} />
            </div>
          ))}
        </div>

        <section style={{ background: bg2 }}>
          <div>
            <div className="d-flex flex-column gap-3">
              <div
                className={`d-flex gap-3 py-2 justify-content-${
                  lgbreakPoint || sm_break_point ? "evenly" : "center"
                }`}
              >
                <div
                  className="d-flex flex-column w-100 gap-4"
                  style={{ maxWidth: "min(600px, 100%)" }}
                >
                  <StatusPage />

                  {categories.map(
                    ({ key, title }) =>
                      Key === key && (
                        <div key={title}>
                          <All_Post_Section loading={loading} category={key} />
                        </div>
                      )
                  )}

                  <PostLoading />
                </div>
                {lgbreakPoint && <SuggetionSlip />}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
