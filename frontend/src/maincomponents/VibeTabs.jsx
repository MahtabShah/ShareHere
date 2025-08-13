import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useTheme } from "../context/Theme";
import All_Post_Section from "../All_Post_Section";
import { usePost } from "../context/PostContext";
export const VibeTabs = () => {
  const [Key, setKey] = useState("all");
  const { limit, page, setPage, fetch_n_posts, setPosts, posts } = usePost();
  const { bg1, bg2, bg3, text_clrH, text_clrM, text_clrL } = useTheme();

  const categories = [
    { key: "all", title: "All", content: posts },
    { key: "motivational", title: "Motivational", content: posts },
    { key: "quotes", title: "Quotes", content: posts },
    { key: "shayari", title: "Shayari", content: posts },
    { key: "fun", title: "Fun", content: posts },
    { key: "love", title: "Love", content: posts },
    { key: "life", title: "Life", content: posts },
    { key: "friendship", title: "Friendship", content: posts },
    { key: "sad", title: "Sad", content: posts },
  ];

  return (
    <>
      <div className="vibeTabs mt-5">
        <Tabs
          id="controlled-tab-example"
          activeKey={Key}
          onSelect={(k) => setKey(k)}
          className="border-0 d-flex gap-3 flex-nowrap none-scroller p-2 overflow-auto"
          transition={false}
          style={{
            "--bg1": bg1,
            "--bg2": bg2,
            "--tc1": text_clrH,
            "--tc2": text_clrM,
            width: "100%",
          }}
        >
          {categories.map(({ key, title, content }) => (
            <Tab eventKey={key} title={title} key={key} className="border-0">
              {Key === key && (
                <All_Post_Section
                  posts={content}
                  category={key}
                  title={title}
                />
              )}
            </Tab>
          ))}
        </Tabs>
      </div>
    </>
  );
};
