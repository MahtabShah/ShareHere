import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CommentSection } from "../src/maincomponents/Home";
import { CardPost } from "../src/maincomponents/Home";
import { Loading } from "./LazyLoading";
import { useQuote } from "../src/context/QueotrContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { clamp } from "lodash";
import { useTheme } from "../src/context/Theme";
import { usePost } from "../src/context/PostContext";
dayjs.extend(relativeTime);

const API = import.meta.env.VITE_API_URL;

export const Notification = ({ setVisibleNotification }) => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating
  const nevigate = useNavigate();
  const [go_comment, setGo_comment] = useState(false);

  const {
    curr_all_notifications,
    mobile_break_point,
    token,
    sm_break_point,
    setopenSlidWin,
  } = useQuote();

  const [comments, setComments] = useState(post?.comments || []); // store comments here
  const { fetch_comments_postId, fetch_post_by_Id } = usePost();

  const CommentFn = async (id) => {
    const postComment = await fetch_comments_postId(id);
    const Fetchpost = await fetch_post_by_Id(id);
    setPost(Fetchpost);
    setComments(postComment);
  };

  const go_to_comment = async (postId, userId) => {
    // navigate(`/home?postId=${post}`);
    setGo_comment(true);
    setLazyLoading(true);

    console.log("postId", postId);

    CommentFn(postId);

    // console.log(post, userId);
    try {
      const res = await axios.get(
        `${API}/api/crud/get_userbyId`,

        { params: { userId }, headers: { Authorization: `Bearer ${token}` } }
      );
      // setLoading(false);
      setUser(res?.data);
      console.log("al  comment of ach post---->res usr ", res.data);

      // setcurr_all_notifications(res.data);
    } catch (error) {
      console.log("erriorrr in notify", error);
    }

    setLazyLoading(false);
  };

  // console.log(curr_all_notifications);
  const Track_post = (postId) => {
    const target = document.getElementById(postId);

    console.log("trackking..................165 app", postId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // If not found, navigate so it gets rendered first
      navigate(`/home/${postId}`);
    }
    setVisibleNotification(false);
  };

  const { text_clrH, text_clrL, text_clrM, bg1, bg2 } = useTheme();

  return (
    <>
      {setVisibleNotification && (
        <div
          className="list p-1 me-1 h-100"
          style={{
            width: `calc(100vw - ${
              mobile_break_point ? "4px" : sm_break_point ? "100px" : "265px"
            })`,
            minHeight: "100px",
            background: bg2,
            color: text_clrM,
          }}
        >
          {/* <h5 className=""></h5> */}
          <div
            className="notification d-flex flex-column gap-4 h-100 w-100 overflow-y-auto"
            style={{
              maxHeight: "80vh",
              // width: "calc(100% - 5px)",
              zIndex: "100",
              background: bg2,
              color: text_clrH,
            }}
          >
            {/* <i className="fa-solid fa-arrow-left"></i> */}
            {/* {LazyLoading && <Loading />} */}
            {LazyLoading || curr_all_notifications.length < 1 ? (
              <Loading dm={32} />
            ) : go_comment ? (
              <div className="">
                <div
                  className="p-1 d-flex gap-3 justify-content-between"
                  style={{ background: bg2, color: text_clrM }}
                >
                  <>
                    <div className="flex-grow-1 w-100">
                      {post?.text.split(" ").slice(0, 40).join(" ")} . . .
                    </div>
                    <div
                      className="h-100"
                      style={{ width: "74px" }}
                      onClick={() => {
                        Track_post(post?._id);
                        setopenSlidWin(false);
                      }}
                    >
                      <CardPost post={post} />
                    </div>
                  </>
                </div>
                <div className="w-100">
                  <section className="">
                    <CommentSection
                      postId={post?._id}
                      comments={comments}
                      setComments={setComments}
                      user={user}
                    />
                  </section>
                </div>
              </div>
            ) : (
              curr_all_notifications?.map((n, idx) => {
                return (
                  <Fragment key={`idx-notify${idx}`}>
                    {n?.type === "follow" && (
                      <div
                        className="followersNotify"
                        key={`curr_notify${idx}`}
                      >
                        <div className="d-flex gap-2">
                          <div
                            className="dpPhoto rounded-circle d-flex justify-content-center align-items-center"
                            style={{
                              maxWidth: "37px",
                              minWidth: "37px",
                              height: "37px",
                              background: `${n?.sender?.bg_clr}`,
                            }}
                          >
                            <img
                              src={n?.sender?.profile_pic}
                              alt=""
                              className="h-100 w-100 rounded-5"
                              style={{ objectFit: "cover" }}
                            />
                            {/* {n?.sender?.username?.charAt(0).toUpperCase()} */}
                          </div>
                          <span className="small">
                            <span className="small d-block fw-light">
                              {dayjs(n?.createdAt).fromNow()}
                            </span>
                            <span className="">
                              <span
                                className="on-hover-userid fw-medium"
                                onClick={() => {
                                  setVisibleNotification(false);
                                  setopenSlidWin(false);
                                  nevigate(`api/user/${n?.sender._id}`);
                                }}
                              >
                                @{n?.sender?.username}
                                {"  "}
                              </span>
                              followed you . .
                            </span>
                          </span>
                        </div>
                      </div>
                    )}

                    {n?.type === "comment" && (
                      <div
                        className="commentNotify"
                        key={`cmnt${idx}`}
                        style={{ background: bg2 }}
                      >
                        <div className="d-flex gap-2">
                          <div
                            className="dpPhoto rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              maxWidth: "37px",
                              minWidth: "37px",
                              height: "37px",
                              background: `${n?.sender?.bg_clr}`,
                              color: text_clrH,
                            }}
                          >
                            {n?.sender && (
                              <img
                                src={n?.sender?.profile_pic}
                                alt=""
                                className="h-100 w-100 rounded-5"
                                style={{ objectFit: "cover" }}
                              />
                            )}
                          </div>
                          <span className="small">
                            <span className="small d-block fw-light">
                              {dayjs(n?.createdAt).fromNow()}
                            </span>
                            <span className="fw-medium d-block">
                              <span
                                className="on-hover-userid fw-medium"
                                onClick={() => {
                                  go_to_comment(n?.post, n?.recipient);
                                  console.log("post with userid ", n.recipient);
                                }}
                                style={{ color: text_clrH }}
                              >
                                @{n?.sender?.username}
                                {"  "}
                                commented . . .{" "}
                              </span>{" "}
                            </span>
                            <span
                              className="justify"
                              style={{ color: text_clrH }}
                            >
                              {" "}
                              {n?.comment?.text
                                ?.split(" ")
                                .slice(0, 16)
                                .join(" ")}
                              {". . . . . ."}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}

                    {n?.type === "like" && (
                      <div className="likeNootify" key={`like${idx}`}>
                        <div className="d-flex gap-2">
                          <div
                            className="dpPhoto rounded-circle border"
                            style={{
                              maxWidth: "37px",
                              minWidth: "37px",
                              height: "37px",
                            }}
                            onClick={() => {
                              navigate(`/api/user/${n?.sender?._id}`);
                              setopenSlidWin(false);
                            }}
                          >
                            {n?.sender?.profile_pic && (
                              <img
                                src={n?.sender?.profile_pic}
                                alt=""
                                className="h-100 w-100 rounded-5"
                                style={{ objectFit: "cover" }}
                              />
                            )}
                          </div>
                          <span className="small">
                            <span className="small d-block fw-light">
                              {dayjs(n?.createdAt).fromNow()}
                            </span>
                            <span
                              className="fw-medium d-block on-hover-userid"
                              onClick={() => {
                                Track_post(n?.post);
                                setopenSlidWin(false);
                              }}
                            >
                              @{n?.sender?.username} liked your post{" "}
                            </span>
                            <span className="justify">
                              {/* You have reached {n?.post} likes */}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                  </Fragment>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};
