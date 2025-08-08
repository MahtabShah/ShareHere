import { useParams } from "react-router-dom";
import { EachPost } from "../src/maincomponents/EachPost";
import { useQuote } from "../src/context/QueotrContext";
import { useState } from "react";
import { useEffect } from "react";
import { Loading } from "./LazyLoading";
import { SearchBaar } from "./SearchBaar";
import SuggetionSlip from "../src/maincomponents/NewUserUpdate";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../src/context/Theme";

export const TrackPost = () => {
  const { postId } = useParams();
  const {
    all_posts,
    all_user,
    all_post_loading,
    mobile_break_point,
    setActiveIndex,
    lgbreakPoint,
  } = useQuote();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const nevigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetch_user_post = async () => {
    setLoading(true);

    const u_post = all_posts?.filter((p) => p._id == postId);
    const u_user = all_user?.filter((u) => u._id == u_post?.[0]?.userId);

    console.log("userId ", u_post, u_user);

    if (u_post?.length > 0 && u_user) {
      setUser(u_user[0]);
      setPost(u_post[0]);
      setLoading(false);
      setError("");
    } else {
      setLoading(false);
      setError("Connection issue or Invalid request , Try Again");
    }
  };

  useEffect(() => {
    if (all_posts?.length > 0 && all_user?.length > 0) {
      fetch_user_post();
      setActiveIndex("");
    }
  }, [postId, all_posts, all_user]);

  const { text_clrH, text_clrL, text_clrM, mainbg, bg1, bg2, bg3 } = useTheme();

  return (
    <>
      <div className="none-scroller" style={{ marginTop: "56px" }}>
        {all_post_loading && (
          <div
            className="text-danger w-100 d-flex justify-content-center align-items-center fs-5 text-center"
            style={{ color: "red" }}
          >
            <Loading dm={32} />
          </div>
        )}
        {error && (
          <div
            className="w-100 d-flex flex-column rounded justify-content-center align-items-center fs-5 "
            style={{ color: "#777" }}
          >
            <p>{error}</p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-danger pe-4 ps-4 ms-3"
                onClick={fetch_user_post}
              >
                Try again
              </button>

              <a className="btn btn-primary pe-4 ps-4 ms-3" href="/home">
                Go to Home
              </a>
            </div>
          </div>
        )}

        <div
          className="d-flex mt-2  align-items-start rounded  overflow-auto  justify-content-center"
          style={{
            gap: "104px",
            marginBottom: "80px",
          }}
        >
          {user && post && (
            <div
              style={{
                maxWidth: "600px",
                boxShadow: `0 1px 3px ${text_clrL} `,
                color: text_clrH,
                background: mainbg,
              }}
              className="rounded m-1 top overflow-hidden "
            >
              <div className="d-flex justify-content-between overflow-hidden ">
                <h5 className="p-2 m-0 d-flex align-items-start gap-3">
                  {" "}
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      translate: "0 -2px",
                      cursor: "pointer",
                      display: "inline-block",
                    }}
                    onClick={() => {
                      nevigate("/home");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      fill={text_clrM}
                    >
                      <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>{" "}
                  </div>
                  <span>Result found here : </span>
                </h5>
                <button
                  className="btn btn-danger props-btn"
                  onClick={() => {
                    nevigate("/home");
                  }}
                >
                  X
                </button>
              </div>

              <EachPost user={user} comment={post} />
            </div>
          )}

          {lgbreakPoint && (
            <div
              className=""
              style={{ marginTop: "64px", position: "sticky", top: 0 }}
            >
              <SuggetionSlip />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
