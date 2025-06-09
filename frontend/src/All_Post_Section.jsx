import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import "./App.css";
import { Loading } from "../TinyComponent/LazyLoading";
import { useLocation } from "react-router-dom";
import { useQuote } from "./context/QueotrContext";
import { EachPost } from "./maincomponents/EachPost";
import { throttle } from "lodash";
const API = import.meta.env.VITE_API_URL;

function All_Post_Section() {
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [loading, setLoading] = useState(false);
  const [lazyLoading, setlazyLoading] = useState(true);

  const { all_user, all_posts, sm_break_point, all_post_loading, Errors } =
    useQuote();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const postId = params.get("postId");

  // Scroll into postId if available
  useEffect(() => {
    if (postId) {
      const target = document.getElementById(postId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [postId, all_posts]);

  // Scroll listener with throttling
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        setLoading(true);
        setTimeout(() => {
          setVisiblePosts((prev) => prev + 3);
          setLoading(false);
        }, 1000);
      }
    }, 500);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Group posts with user info
  const visiblePostComponents = useMemo(() => {
    setlazyLoading(true);
    if (!all_posts || !all_user) return [];

    const mergedPosts = all_posts.map((post) => {
      const user = all_user.find((u) => u._id === post.userId);
      return { post, user };
    });

    setlazyLoading(false);

    return mergedPosts.slice(0, visiblePosts);
  }, [all_posts, all_user, visiblePosts]);

  return (
    <div
      className="p-0 col-sm-12 col-md-12 col-lg-10"
      style={{ margin: "auto" }}
    >
      <section
        className="p-0"
        style={{
          marginTop: "34px",
          marginBottom: "84px",
          // marginLeft: `${!sm_break_point ? "200px" : "0"}`,
        }}
      >
        {Errors ? (
          <div
            className="fs-3 text-danger p-2 d-flex justify-content-center align-items-center"
            style={{ height: "64vh" }}
          >
            {Errors.message} . . .try leter !
          </div>
        ) : (
          <section
            className={`${sm_break_point ? "p-0" : "p-0"}`}
            style={{ margin: "auto", maxWidth: "600px" }}
          >
            {all_post_loading ? (
              <div className="d-flex justify-content-center p-3">
                <Loading dm={34} />
              </div>
            ) : (
              visiblePostComponents.map(
                ({ post, user }, idx) =>
                  user &&
                  post && (
                    <div key={`comment-${idx}`} id={post._id}>
                      <EachPost user={user} comment={post} />
                    </div>
                  )
              )
            )}

            {loading && (
              <div className="d-flex justify-content-center p-3">
                <Loading dm={34} />
              </div>
            )}
          </section>
        )}
      </section>
    </div>
  );
}

export default All_Post_Section;
