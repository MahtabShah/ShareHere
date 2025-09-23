import { useParams } from "react-router-dom";
import { EachPost } from "../src/maincomponents/EachPost";
import { useQuote } from "../src/context/QueotrContext";
import { useState } from "react";
import { useEffect } from "react";
import { Loading } from "./LazyLoading";
import SuggetionSlip from "../src/maincomponents/NewUserUpdate";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../src/context/Theme";
import { usePost } from "../src/context/PostContext";

export const TrackPost = () => {
  const { postId } = useParams();
  const { setActiveIndex, lgbreakPoint } = useQuote();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nevigate = useNavigate();

  const { fetch_post_by_Id, fetch_user_by_Id } = usePost();

  const CommentFn = async (id) => {
    setError("");

    setLoading(true);
    const Fetchpost = await fetch_post_by_Id(id);
    const FetchUser = await fetch_user_by_Id(Fetchpost?.userId);
    if (!FetchUser || !Fetchpost) {
      setTimeout(() => {
        setLoading(false);
        setError("No vibe for this route");
      }, 1000);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    setPost(Fetchpost);
    setUser(FetchUser);
    console.log(post);
  };

  useEffect(() => {
    CommentFn(postId);
    setActiveIndex("");
  }, [postId]);

  const { text_clrH, text_clrL, text_clrM, mainbg } = useTheme();

  return (
    <>
      <div className="none-scroller" style={{ marginTop: "56px" }}>
        {loading && (
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
                onClick={() => {
                  CommentFn(postId);
                }}
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
          className="d-flex mt-2  align-items-start rounded  justify-content-center"
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
              style={{
                marginTop: "0px",
                position: "sticky",
                top: "64px",
                width: "340px",
              }}
            >
              <SuggetionSlip />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
