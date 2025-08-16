import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useMemo } from "react";
import "./App.css";
import { Loading } from "../TinyComponent/LazyLoading";
import { useLocation } from "react-router-dom";
import { useQuote } from "./context/QueotrContext";
import { EachPost } from "./maincomponents/EachPost";
import { throttle } from "lodash";
import SuggetionSlip, {
  SuggetionSlipInPost,
} from "./maincomponents/NewUserUpdate";
import { useTheme } from "./context/Theme";
import { usePost, Rank_Calculation } from "./context/PostContext";

function All_Post_Section({ category }) {
  const [loading, setLoading] = useState(true);
  const [rn, setRn] = useState(null);

  const {
    all_user,
    sm_break_point,
    Errors,
    lgbreakPoint,
    openSlidWin,
    setActiveIndex,
  } = useQuote();

  const { limit, page, post_loading, fetch_n_posts, setPosts, posts } =
    usePost();
  const { bg2, bg1, text_clrM } = useTheme();

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = throttle(async () => {
      setLoading(true);
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        const data = await fetch_n_posts(limit, page, category);
        // console.log("Fetching page:", page, data);

        if (data?.length > 0) {
          const sorted = data
            .map((post) => ({
              ...post,
              rank: Rank_Calculation(post),
            }))
            .sort((a, b) => b.rank - a.rank);

          setPosts((prev) => [...prev, ...sorted]);
        }

        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }, 500);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);

  const visible_post = useMemo(() => {
    if (!posts || !all_user) return [];

    return posts.map((post) => {
      const user = all_user.find((u) => u?._id === post.userId);
      return { post, user };
    });
  }, [posts, all_user]);

  useEffect(() => {
    setRn(Math.floor(Math.random() * 10 + 1));
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [category]);

  useEffect(() => {
    if (!openSlidWin) {
      setActiveIndex("Home");
    }
  }, [openSlidWin]);

  return (
    <div className="position-relative mb-5" style={{ background: bg2 }}>
      <section
        style={{
          marginBottom: "90px",
          margin: "auto",
          gap: lgbreakPoint ? "100px" : "0",
          maxWidth: "100%",
        }}
        className={`d-flex justify-content-${
          lgbreakPoint || sm_break_point ? "center" : "evenly"
        }`}
      >
        {Errors ? (
          <div
            className="fs-3 text-danger p-2 d-flex justify-content-center align-items-center"
            style={{ height: "64vh" }}
          >
            {Errors.message} . . .Try again later or refresh the page!
          </div>
        ) : (
          <div style={{ maxWidth: "min(600px, 100%)" }}>
            <>
              <div className="d-flex flex-column">
                <div className="d-flex flex-column gap-3">
                  {visible_post.map(
                    ({ post, user }, idx) =>
                      user &&
                      post && (
                        <div
                          key={`comment-${idx}`}
                          id={post?._id}
                          className="d-flex flex-column"
                        >
                          <EachPost user={user} comment={post} />
                          {rn && rn + 1 > idx && idx > rn - 1 && (
                            <div
                              className="mt-4 mb-3 p-1 rounded-3 d-flex gap-4 none-scroller overflow-x-auto"
                              style={{ maxWidth: "100%" }}
                            >
                              <SuggetionSlipInPost />
                            </div>
                          )}
                        </div>
                      )
                  )}
                </div>
              </div>
              <div
                className="d-flex justify-content-center"
                style={{ height: "84px" }}
              >
                {post_loading ? (
                  <div className="p-3">
                    {" "}
                    <Loading dm={34} />
                  </div>
                ) : (
                  <p className="p-3 text-center" style={{ color: text_clrM }}>
                    Not available any more vibe at this time : Try again or
                    refresh
                  </p>
                )}
              </div>
            </>
          </div>
        )}

        {lgbreakPoint && posts?.length && (
          <div
            style={{
              position: "sticky",
              width: "340px",
            }}
          >
            <SuggetionSlip />
          </div>
        )}
      </section>
    </div>
  );
}

export default All_Post_Section;
