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
    { key: "quotes", title: "Quotes", content: posts },
    { key: "shayari", title: "Shayari", content: posts },
    { key: "sad", title: "Sad", content: posts },
    { key: "love", title: "Love", content: posts },
    { key: "life", title: "Life", content: posts },
    { key: "motivational", title: "Motivational", content: posts },
    { key: "success", title: "Success", content: posts },
    { key: "discipline", title: "Discipline", content: posts },
    { key: "mindset", title: "Mindset", content: posts },
    { key: "overcoming-failure", title: "Overcoming Failure", content: posts },
    { key: "self-love", title: "Self Love", content: posts },
    { key: "friendship", title: "Friendship", content: posts },
    { key: "family", title: "Family", content: posts },
    { key: "truth", title: "Truth", content: posts },
    { key: "patriotic", title: "Patriotic", content: posts },
    { key: "funny", title: "Funny", content: posts },
    { key: "ghazal", title: "Ghazal", content: posts },
    { key: "nazm", title: "Nazm", content: posts },
    { key: "sufi", title: "Sufi Shayari", content: posts },
    { key: "poetry", title: "Poetry", content: posts },
    { key: "free-verse", title: "Free Verse", content: posts },
    { key: "lyric-poetry", title: "Lyric Poetry", content: posts },
    { key: "narrative-poetry", title: "Narrative Poetry", content: posts },
    { key: "satire", title: "Satire", content: posts },
    { key: "life-quotes", title: "Life Quotes", content: posts },
    { key: "success-quotes", title: "Success Quotes", content: posts },
    { key: "sad-quotes", title: "Sad Quotes", content: posts },
  ];

  return (
    <>
      <div className="vibeTabs mt-5">
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
          {categories.map(({ key, title, content }) => (
            <Tab
              eventKey={key}
              title={title}
              key={key}
              className="border-0"
              style={{ marginTop: "96px" }}
            >
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
