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
import { SearchBaar } from "../TinyComponent/SearchBaar";
import { TrackPost } from "../TinyComponent/TrackPost";

function All_Post_Section() {
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [loading, setLoading] = useState(false);
  const [lazyLoading, setlazyLoading] = useState(true);

  const {
    all_user,
    all_posts,
    mobile_break_point,
    sm_break_point,
    all_post_loading,
    Errors,
    lgbreakPoint,
    openSlidWin,
    setActiveIndex,
    fetch_all_posts,
  } = useQuote();
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
    const handleScroll = throttle(async () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        setLoading(true);
        // }
        setTimeout(() => {
          setVisiblePosts((prev) => prev + 5);
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
      const user = all_user.find((u) => u?._id === post.userId);
      return { post, user };
    });

    setlazyLoading(false);

    return mergedPosts.slice(0, visiblePosts);
  }, [all_posts, all_user, visiblePosts]);

  // const rn = Math.floor(Math.random() * (all_posts?.length - 3) + 1);
  const rn = 3;
  const { bg2, text_clrL, bg1 } = useTheme();

  useEffect(() => {
    if (!openSlidWin) {
      setActiveIndex("Home");
    }
  }, [openSlidWin]);

  return (
    <>
      <div
        className="position-relative pt-3"
        style={{
          zIndex: 10,
          maxWidth: "100%",
          marginTop: "48px",
          background: bg2,
          minHeight: "100vh",
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
              {Errors.message} . . .try leter !
            </div>
          ) : (
            <div style={{ maxWidth: "min(600px, 100%)" }}>
              {all_post_loading ? (
                <div className="d-flex justify-content-center mt-5">
                  <Loading dm={34} />
                </div>
              ) : (
                <div className="d-flex flex-column" style={{}}>
                  {/* <TrackPost /> */}

                  <div className="d-flex flex-column gap-3" style={{}}>
                    {visiblePostComponents.map(
                      ({ post, user }, idx) =>
                        user &&
                        post && (
                          <>
                            <div
                              key={`comment-${idx}`}
                              id={post?._id}
                              style={{}}
                              className="d-flex flex-column"
                            >
                              <EachPost user={user} comment={post} />

                              <>
                                {rn + 1 > idx && idx > rn - 1 && (
                                  <div
                                    className="mt-4 mb-3 rounded-3 d-flex gap-4  none-scroller overflow-x-auto"
                                    style={{
                                      maxWidth: "100% ",
                                      // border: `1px solid ${text_clrL}`,
                                      // background: bg1,
                                    }}
                                  >
                                    <SuggetionSlipInPost />
                                  </div>
                                )}
                              </>
                            </div>
                          </>
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
              className=""
              style={{
                position: "sticky",
                top: "0",
                width: "320px",
              }}
            >
              <SuggetionSlip />
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default All_Post_Section;
