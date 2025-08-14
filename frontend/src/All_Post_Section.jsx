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

function All_Post_Section({ posts, category }) {
  const [loading, setLoading] = useState(false);

  const {
    all_user,
    sm_break_point,
    all_post_loading,
    Errors,
    lgbreakPoint,
    openSlidWin,
    setActiveIndex,
    setAll_post_loading,
  } = useQuote();

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const postId = params.get("postId");

  const { limit, page, setPage, fetch_n_posts, setPosts } = usePost();
  const { bg2, bg1 } = useTheme();

  // Scroll into postId if available
  useEffect(() => {
    if (postId) {
      const target = document.getElementById(postId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [postId, posts]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = throttle(async () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        if (loading) return; // prevent multiple triggers
        setLoading(true);

        // Always use the latest page value
        const currentPage = page;
        console.log("Fetching page:", currentPage);

        const data = await fetch_n_posts(limit, currentPage, category);
        setPage((prev) => prev + 1); // move to next page

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
        }, 10000);
      }
    }, 500);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, fetch_n_posts, limit, setPosts, loading]);

  useEffect(() => {
    const fetchPost = async () => {
      setAll_post_loading(true);
      const data = await fetch_n_posts(limit, 0, category);

      setPosts(
        data
          .map((post) => ({
            ...post,
            rank: Rank_Calculation(post),
          }))
          .sort((a, b) => b.rank - a.rank)
      );
      setPage(1); // move to next page
      setAll_post_loading(false);
    };

    fetchPost();
  }, [category]);

  // Merge posts with user info
  const visible_post = useMemo(() => {
    if (!posts || !all_user) return [];

    return posts.map((post) => {
      const user = all_user.find((u) => u?._id === post.userId);
      return { post, user };
    });
  }, [posts, all_user]);

  const rn = 3;

  useEffect(() => {
    if (!openSlidWin) {
      setActiveIndex("Home");
    }
  }, [openSlidWin]);

  return (
    <div
      className="position-relative mb-5"
      style={{
        background: bg2,
      }}
    >
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
            {Errors.message} . . .try later !
          </div>
        ) : (
          <div style={{ maxWidth: "min(600px, 100%)" }}>
            {all_post_loading ? (
              <div className="d-flex justify-content-center mt-5">
                <Loading dm={34} />
              </div>
            ) : (
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
                          {rn + 1 > idx && idx > rn - 1 && (
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
            )}
            <div
              className="d-flex justify-content-center p-3 my-3"
              style={{ height: "44px" }}
            >
              {loading && <Loading dm={34} />}
            </div>
          </div>
        )}

        {lgbreakPoint && (
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

      {posts.length === 0 && !all_post_loading && (
        <p className="p-3 text-center">
          No vibe for this category : {category}
        </p>
      )}
    </div>
  );
}

export default All_Post_Section;
