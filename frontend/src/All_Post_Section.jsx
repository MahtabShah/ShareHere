import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import "./App.css";
import { Loading } from "../TinyComponent/LazyLoading";
import { useLocation } from "react-router-dom";
import { useQuote } from "./context/QueotrContext";
import { EachPost } from "./maincomponents/EachPost";
import { throttle } from "lodash";
import SuggetionSlip, {
  SuggetionSlipInPost,
} from "./maincomponents/NewUserUpdate";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
import { useTheme } from "./context/Theme";

function All_Post_Section() {
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [loading, setLoading] = useState(false);
  const [lazyLoading, setlazyLoading] = useState(true);

  const {
    all_user,
    all_posts,
    sm_break_point,
    all_post_loading,
    Errors,
    lgbreakPoint,
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
    const handleScroll = throttle(() => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        // if (visiblePosts < all_posts?.length) {
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

  const rn = 6;

  // const [img, setImg] = useState("https://zenquotes.io/api/image");

  // const getImg = async () => {
  //   const res = await axios.get("https://inspirobot.me/api?generate=true");
  //   console.log(res);
  //   setImg(res.data);
  // };

  // useEffect(() => {
  //   getImg();
  // }, []);

  const { mainbg } = useTheme();

  return (
    <>
      <div
        className="position-relative"
        style={{
          background: mainbg,
          zIndex: 10,
        }}
      >
        <section
          style={{
            marginBottom: "90px",
            margin: "auto",
          }}
          className={`d-flex justify-content-${
            !lgbreakPoint ? "center" : "evenly"
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
            <div style={{ maxWidth: "600px" }}>
              {all_post_loading ? (
                <div className="d-flex justify-content-center ">
                  <Loading dm={34} />
                </div>
              ) : (
                <div className="d-flex flex-column gap-5" style={{}}>
                  {visiblePostComponents.map(
                    ({ post, user }, idx) =>
                      user &&
                      post && (
                        <div key={`comment-${idx}`} id={post?._id} style={{}}>
                          <EachPost user={user} comment={post} />
                          {/* {rn + 1 > idx && idx > rn - 1 && (
                              <div className="mt-5">
                                <SuggetionSlipInPost />
                              </div>
                            )} */}
                        </div>
                      )
                  )}
                </div>
              )}

              <div
                className="d-flex justify-content-center p-3"
                style={{ height: "44px" }}
              >
                {loading && <Loading dm={34} />}
              </div>
            </div>
          )}

          <div className="mt-4">
            <SuggetionSlip />
          </div>
        </section>
      </div>
    </>
  );
}

export default All_Post_Section;
