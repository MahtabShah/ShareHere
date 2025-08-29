import { useEffect, useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import { useTheme } from "../context/Theme";
import All_Post_Section from "../All_Post_Section";
import { usePost } from "../context/PostContext";
import { categories, fontSize } from "../StanderdThings/StanderdData";
import { Rank_Calculation } from "../context/PostContext";
import StatusPage from "./StatusPage";
import { useQuote } from "../context/QueotrContext";

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
  const { limit, page, fetch_n_posts, setPosts, post_loading } = usePost();
  const { bg1, bg2, bg3, text_clrH, text_clrM, text_clrL } = useTheme();
  const [loading, setLoading] = useState(true);
  const [Key, setKey] = useState("all");
  const { mobile_break_point, sm_break_point } = useQuote();

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
    right: `4px`,
    cursor: "pointer",
    background: bg2,
  };

  return (
    <>
      <div className="vibeTabs  position-relative mt-5 h-100 overflow-auto">
        <div
          className="p-2 position-fixed d-flex gap-2 overflow-auto none-scroller"
          style={{ ...TabStyle }}
        >
          {categories.map(({ key, title }) => (
            <div key={title} onClick={() => setKey(key)}>
              <Tab category={key} Key={Key} />
            </div>
          ))}
        </div>

        <div className="w-100 d-flex">
          <StatusPage />
        </div>

        {categories.map(
          ({ key, title }) =>
            Key === key && (
              <div key={title}>
                <All_Post_Section loading={loading} category={key} />
              </div>
            )
        )}
      </div>
    </>
  );
};
