import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

function All_Post_Section() {
  const [visiblePosts, setVisiblePosts] = useState(5);
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
  return (
    <>
      {/* <div className="p-3 m-2">
        <p>
          {" "}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
          dolorum tempore inventore optio odio aut quo ea deserunt ratione
          officiis distinctio id dolorem nobis magni possimus consequatur a,
          quis ipsam!
        </p>
        <div style={{ width: "220px", aspectRatio: "2/3" }}>
          <img src={img} alt="" className="w-100" />
        </div>
      </div> */}
      <div className="" style={{ margin: "auto" }}>
        <section
          style={{
            marginBottom: "84px",
            // border: "1px solid red",
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
            <div
              className="d-flex gap-4 justify-content-evenly"
              style={
                {
                  // border: "2px solid blue",
                }
              }
            >
              <section
                className={`${
                  sm_break_point ? "p-0" : "p-0"
                } d-flex flex-column`}
                style={{
                  // margin: "auto",
                  maxWidth: "600px",
                  // border: "2px solid blue",
                }}
              >
                {all_post_loading ? (
                  <div className="d-flex justify-content-center p-3">
                    <Loading dm={34} />
                  </div>
                ) : (
                  <>
                    {visiblePostComponents.map(
                      ({ post, user }, idx) =>
                        user &&
                        post && (
                          <div key={`comment-${idx}`} id={post?._id}>
                            <EachPost user={user} comment={post} />
                            {/* {rn + 1 > idx && idx > rn - 1 && (
                              <div className="mt-5">
                                <SuggetionSlipInPost />
                              </div>
                            )} */}
                          </div>
                        )
                    )}
                  </>
                )}

                <div
                  className="d-flex justify-content-center p-3"
                  style={{ height: "44px" }}
                >
                  {loading && <Loading dm={34} />}
                </div>
              </section>

              <SuggetionSlip />
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default All_Post_Section;
