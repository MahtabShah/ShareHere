import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useTheme } from "../context/Theme";
import All_Post_Section from "../All_Post_Section";
import { usePost } from "../context/PostContext";
import { categories } from "../StanderdThings/StanderdData";
import { Rank_Calculation } from "../context/PostContext";
import StatusPage from "./StatusPage";

export const VibeTabs = () => {
  const [Key, setKey] = useState("all");
  const { limit, page, fetch_n_posts, setPosts, post_loading } = usePost();
  const { bg1, bg2, bg3, text_clrH, text_clrM, text_clrL } = useTheme();
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <div className="vibeTabs mt-5">
        <div className="w-100 d-flex">
          <StatusPage />
        </div>

        <Tabs
          id="controlled-tab-example"
          activeKey={Key}
          onSelect={(k) => setKey(k)}
          className="border-0 d-flex position-fixed mt-5 top-0 gap-3 flex-nowrap none-scroller p-2 overflow-auto"
          transition={false}
          style={{
            "--bg1": bg1,
            "--bg2": bg2,
            "--tc1": text_clrH,
            "--tc2": text_clrM,
            width: "100%",
            zIndex: 1000,
            background: bg2,
          }}
        >
          {categories.map(({ key, title }) => (
            <Tab
              eventKey={key}
              title={title}
              key={key}
              className="border-0 py-0"
            >
              {Key === key && (
                <All_Post_Section loading={loading} category={key} />
              )}
            </Tab>
          ))}
        </Tabs>
      </div>
    </>
  );
};
