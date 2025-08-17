// ----------------------------------Done------------------------------------

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MdSend } from "react-icons/md";
import { Loading } from "../../TinyComponent/LazyLoading";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart } from "react-icons/fa"; // from Font Awesome
import { BiShare, BiChat, BiHeart, BiFontFamily } from "react-icons/bi";
import Nav from "react-bootstrap/Nav";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { CommentSection } from "./Home";
import ReportPost from "../../TinyComponent/Report";
import { useQuote } from "../context/QueotrContext";
import follow_us from "/src/assets/follow-us.png";
const API = import.meta.env.VITE_API_URL;
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { usePost } from "../context/PostContext";
import { useTheme } from "../context/Theme";

function formatNumber(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export const EachPost = ({ user, comment }) => {
  const [open_comment, setopen_comment] = useState(false);
  const [new_comment, setnew_comment] = useState("");
  const [LazyLoading, setLazyLoading] = useState(false);
  const [isdotClicked, setdotClicked] = useState(false);
  const [comments, setComments] = useState(comment?.comments || []); // store comments here
  const nevigate = useNavigate();
  const [mode, setMode] = useState(comment?.mode);

  const { admin_user, token, HandleShare, mobile_break_point } = useQuote();
  const postId = comment?._id;

  const Handlecomment = (e) => setnew_comment(e.target.value);

  const SubmitComment = async (e, id) => {
    e.preventDefault();
    if (!admin_user) {
      nevigate("/login") || nevigate("/signup");
      return;
    }
    try {
      setLazyLoading(true);
      const res = await axios.put(
        `${API}/api/auth/set_comment_this_post`,
        {
          id: id,
          new_comment: new_comment,
          adminId: admin_user?._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(res?.data?.comments); // append new comment instantly
      setnew_comment("");
    } catch (err) {
      alert("comment failed: " + err.response?.data?.message || err.message);
    }
    setLazyLoading(false);
  };

  useEffect(() => {
    if (user && user?.followers && admin_user) {
      const isFollower = user?.followers?.includes(admin_user?._id);
      setMode(
        isFollower || admin_user?._id == user?._id ? "Public" : comment?.mode
      );
    }
  }, [admin_user?.followers]);

  const { text_clrL, text_clrM, mainbg, bg1, bg2, bg3 } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("4.5");
  const [shouldTruncate, setShouldTruncate] = useState(false);

  useEffect(() => {
    if (expanded) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(`${scrollHeight}px`);
    } else {
      setHeight("4.5em");
    }
  }, [expanded]);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      const isTruncated = el.scrollHeight > el.clientHeight + 1;
      setShouldTruncate(isTruncated);
    }
  }, [comment.text]);

  const seenRef = useRef(null);
  useEffect(() => {
    const rect = seenRef.current?.getBoundingClientRect();
    if (postId && rect?.top < window.innerHeight && rect?.bottom >= 0) {
      axios
        .post(`${API}/api/crud/post_seen/${postId}`)
        .catch((err) => console.error("Error marking as seen:", err));
    }
  }, [postId]);

  const { fetch_comments_postId } = usePost();

  const CommentFn = async () => {
    const postComment = await fetch_comments_postId(postId);
    setComments(postComment);
  };

  useEffect(() => {
    CommentFn(postId);
  }, [postId]);

  return (
    <div ref={seenRef} style={{ borderBottom: `1px solid ${text_clrL}` }}>
      <div
        className="d-flex flex-column gap-2 position-relative bglight"
        key={comment?._id}
        style={{ background: mainbg }}
      >
        {/* user header */}
        <div className="d-flex gap-2 px-2 align-items-center pt-2 justify-content-between flex-grow-1">
          <div className="d-flex flex-grow-1">
            <UserRing user={user} />
          </div>

          <div
            className="d-flex flex-column justify-content-start align-items-end"
            style={{ minWidth: "max-content" }}
          >
            {user?._id !== admin_user?._id && (
              <FollowBtn
                id={user?._id}
                cls={`rounded-0 pe-0 fw-medium text-primary border-0`}
                style={{
                  fontSize: "13px",
                  cursor: "pointer",
                  background: "transparent",
                  fontFamily: "monospace",
                }}
              />
            )}

            {user?._id === admin_user?._id && (
              <div className="small">
                <StatusBtn post={comment} />
              </div>
            )}

            <div
              className={`d-flex  ${
                false ? "flex-column align-items-end" : "gap-2"
              }`}
              style={{ fontSize: "13px", color: text_clrM }}
            >
              <small>{user?.followers?.length} followers</small>
              <small style={{ color: text_clrM }}>
                {dayjs(comment?.createdAt).fromNow()}
              </small>
            </div>
          </div>
        </div>

        {/* post image */}
        <div>
          <ul style={{ listStyle: "none" }} className="p-0 m-0">
            <div
              className={`d-flex align-items-center ${
                mobile_break_point ? "" : "px-2"
              }`}
              style={{ overflow: "hidden" }}
            >
              <div className="p-0 w-100 position-relative">
                <div className="bg-image d-flex align-items-center flex-column">
                  {mode == "Public" && (
                    <img
                      src={`${comment?.images[0]}`}
                      loading="lazy"
                      className={`w-100 h-100 rounded-${
                        mobile_break_point ? "0" : "1"
                      }`}
                      style={{ objectFit: "cover" }}
                    />
                  )}

                  {mode == "Follower" && (
                    <div
                      className={`d-flex align-items-center flex-column h-100  rounded-${
                        mobile_break_point ? "0" : "1"
                      }`}
                      style={{ background: text_clrL }}
                    >
                      <div style={{ width: "180px" }}>
                        <img
                          src={follow_us}
                          alt=""
                          className={`h-100 w-100`}
                          style={{ objectFit: "cover", opacity: "0.4" }}
                        />
                      </div>
                      <p className="p-2 px-3 fs-5">
                        This is for <b>Followers only</b>. Follow{" "}
                        <b>@{user?.username}</b> to access this.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* post text */}
            <li
              className={`w-100 flex-grow-1 d-flex rounded-3 mt-2`}
              style={{ color: text_clrM }}
            >
              {comment && (
                <div
                  key={comment.text}
                  className="w-100 px-2"
                  style={{
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <div
                    ref={contentRef}
                    style={{
                      display: expanded ? "block" : "-webkit-box",
                      WebkitLineClamp: expanded ? "unset" : 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {comment.text}
                  </div>

                  {shouldTruncate && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      aria-expanded={expanded}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: text_clrM,
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "inherit",
                        minWidth: "10px",
                      }}
                    >
                      {expanded ? " less" : " more"}
                    </button>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* like / comment / share */}
        <div className="d-flex flex-column px-2">
          <div
            className={`d-flex pt-1 justify-content-between like-comment-share`}
            style={{ color: text_clrM }}
          >
            <div className="d-flex gap-4 ">
              <LikeBtn post={comment} size={20} />
              <span
                className="fw-semibold d-flex align-items-center gap-1"
                onClick={() => setopen_comment(!open_comment)}
              >
                <span
                  style={{
                    marginTop: "0.2rem",
                    color: open_comment ? "#a0a" : "",
                  }}
                >
                  <BiChat size={20} color={open_comment ? "#a0a" : ""} />{" "}
                  {comments.length}&nbsp;
                </span>
              </span>
              <span
                className="fw-semibold"
                onClick={() => HandleShare(comment?._id)}
              >
                <BiShare size={20} />
              </span>
            </div>

            <div className="d-flex align-items-center">
              <div
                className="small border rounded-1"
                style={{
                  fontSize: "12px",
                  background: bg2,
                }}
              >
                <small className="p-2">
                  {comment?.category &&
                    comment.category.charAt(0).toUpperCase() +
                      comment.category.slice(1)}
                </small>
              </div>

              <div
                className="d-flex"
                onClick={() => setdotClicked(!isdotClicked)}
                style={{
                  rotate: isdotClicked ? "-45deg" : "",
                  translate: mobile_break_point ? "4px" : "7px",
                }}
              >
                <BsThreeDotsVertical size={18} />
              </div>
            </div>
          </div>

          <span className="pb-1" style={{ color: text_clrM, fontSize: "12px" }}>
            {formatNumber(comment?.views || 1)} views
          </span>
        </div>
      </div>

      {isdotClicked && (
        <div
          className={`small fw-medium d-flex flex-wrap gap-3 py-2 px-2`}
          style={{ color: text_clrM, background: mainbg }}
        >
          <SlipDotinPost user={user} post={comment} />
        </div>
      )}

      {/* comment box */}
      <section style={{ background: mainbg, color: text_clrM }}>
        {(admin_user?._id != user?._id || open_comment) && (
          <div className="gap-1 pt-2 d-flex flex-column position-relative">
            <div className="d-flex gap-1 pb-2  px-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-crcle text-white me-2 overflow-hidden"
                style={{
                  minWidth: "40px",
                  maxWidth: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: `${admin_user?.bg_clr || "#2a1"}`,
                  cursor: "pointer",
                }}
                onClick={() => nevigate(`/api/user/${admin_user?._id}`)}
              >
                <img
                  src={admin_user?.profile_pic}
                  className="h-100 w-100"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <textarea
                required
                className="w-100 shadow-none border-0 rounded-0 ps-0 mt-2 fs-0 small"
                placeholder="Write your sentence here..."
                onChange={Handlecomment}
                onInput={(e) => {
                  e.target.style.height = "30px";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                value={new_comment}
                style={{
                  marginTop: "0.1rem",
                  background: mainbg,
                  color: text_clrM,
                }}
              />

              <div className="d-flex gap-3" style={{ alignSelf: "end" }}>
                <button
                  className="btn border-0 p-1 ps-3 pe-0 rounded-0"
                  onClick={(e) => SubmitComment(e, comment?._id)}
                >
                  {LazyLoading ? (
                    <Loading clr={"light"} />
                  ) : (
                    <MdSend size={22} color={text_clrM} />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {open_comment && (
          <div className="p-2 border-top">
            <CommentSection
              postId={postId}
              comments={comments}
              setComments={setComments}
              user={user}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export const UserRing = ({
  onlyphoto = false,
  user,
  style = { borderEndEndRadius: "0" },
  dm = 44,
}) => {
  const nevigate = useNavigate();
  const { text_clrH, text_clrL, text_clrM } = useTheme();
  const { setopenSlidWin } = useQuote();

  return (
    <>
      <div className="d-flex gap-2 flex-grow-1 align-items-center">
        <div
          className="d-flex align-items-center w-100 justify-content-center rounded-crcle overflow-hidden vibe-ring border"
          style={{
            maxWidth: `${dm}px`,
            minWidth: `${dm}px`,
            height: `${dm}px`,
            background: `${user?.bg_clr}`,
            cursor: "pointer",
            ...style,
            color: text_clrH,
          }}
          onClick={() => {
            setopenSlidWin(false);
            nevigate(`/api/user/${user?._id}`);
          }}
        >
          {/* <div>{user?.username?.charAt(0).toUpperCase()}</div> */}
          <div className="overflow-hidden">
            <img
              src={user?.profile_pic}
              alt=""
              className="h-100 w-100 overflow-hidden"
              style={{
                objectFit: "cover",
                maxWidth: `${dm}px`,
                minWidth: `${dm}px`,
                minHeight: `${dm}px`,
              }}
            />
          </div>
        </div>

        {!onlyphoto && (
          <div
            className=" d-flex flex-column small align-item"
            style={{ color: text_clrM }}
          >
            <small
              className="small fw-medium on-hover-userid"
              onClick={() => {
                setopenSlidWin(false);

                nevigate(`/api/user/${user?._id}`);
              }}
            >
              @{user?.username}
            </small>
            {user && user?.bio && (
              <small
                className="small overflow-hidden none-scroller w-100"
                style={{
                  height: "18px",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {user?.bio}
              </small>
            )}
          </div>
        )}
      </div>
    </>
  );
};

/**
 * NOTE: Always ensure that when you use FollowBtn, you pass the latest user object
 * (with up-to-date followers array) as a prop, and update it in the parent component
 * when the follow status changes. This ensures the FollowBtn reflects the correct state.
 * we can also fetch letest user by its id in follow btn, ok next time In Sha Allah
 */

export const FollowBtn = ({ id, cls, style = {} }) => {
  const { admin_user, token } = useQuote();
  const { fetch_user_by_Id } = usePost();
  const [user, setUser] = useState(null);
  const [isFollower, setIsFollower] = useState(false);

  const fetxchUser = async () => {
    const usr = await fetch_user_by_Id(id);
    setIsFollower(usr?.followers?.some((u) => u._id == admin_user?._id));
    setUser(usr);
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    if (!admin_user) {
      navigate("/login");
      return;
    }

    try {
      setIsFollower((prev) => !prev);

      await axios.put(
        `${API}/api/crud/crud_follow_post`,
        { id: user?._id, adminId: admin_user?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error updating follow status:", err);
    }
  };

  useEffect(() => {
    fetxchUser();
  }, [admin_user?.followers]);

  if (admin_user?._id === user?._id) return null;

  return (
    <>
      {user && (
        <div
          className={`${cls}`}
          onClick={handleClick}
          style={{ ...style, minWidth: "max-content" }}
          aria-readonly={true}
        >
          {isFollower ? "Unfollow" : "Follow"}
        </div>
      )}
    </>
  );
};

export const SlipDotinPost = ({ user, post }) => {
  const [report, setReport] = useState(false);
  const { admin_user, token } = useQuote();
  const { text_clrM } = useTheme();

  const HandleDelete = async () => {
    const condition = window.confirm("want to delete............");

    if (condition) {
      try {
        const res = await axios.delete(`${API}/api/crud/crud_delete_post`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: post?._id }, // pass id inside `data`
        });
        // setisliked(!isliked);
      } catch (err) {
        console.log(
          "deleteing failed: " + err.response?.data?.message || err.message
        );
      }
    }
  };

  return (
    <>
      <Nav.Link href="/home">Home</Nav.Link>
      <Nav.Link href={`/home/${post._id}`}>Visit Post</Nav.Link>
      {post?.userId === admin_user?._id ? (
        // this way is just for temporary...!!!

        <>
          <Nav.Link href={`/post/edit/${post._id}`}>Edit Post</Nav.Link>
          <Nav.Link onClick={HandleDelete} className=" pe-2 ps-2 text-danger">
            Delete
          </Nav.Link>
        </>
      ) : (
        ""
      )}{" "}
      <Nav.Link
        href="#"
        className="text-danger"
        onClick={() => {
          setReport(!report);
        }}
      >
        {/* <span
          className="d-inline-flex bg-danger text-light justify-content-center"
          style={{
            minWidth: "20px",
            clipPath: "polygon(0 100%, 50% 0 , 100% 100%)",
          }}
        >
          !
        </span>{" "} */}
        Report
      </Nav.Link>
      {report && <ReportPost postId={post?._id} />}
    </>
  );
};

export const LikeBtn = ({ post, size = 18 }) => {
  const [Post, setPost] = useState(post);
  // console.log("post type ", post);
  const [animatingBtn, setAnimatingBtn] = useState(null); // to track which button is animating
  const token = localStorage.getItem("token");
  const { admin_user } = useQuote();
  const navigate = useNavigate();

  const [isliked, setIsliked] = useState(
    post?.likes?.includes(admin_user?._id)
  );

  // Handle animation on click
  const animateButton = (btnName) => {
    setAnimatingBtn(btnName);
    setTimeout(() => {
      setAnimatingBtn(null);
    }, 400); // duration of animation
  };

  const HandleLike = async (id) => {
    animateButton("likes");
    // console.log("eeeeeeeeeeee", post?.likes);

    try {
      const res = await axios.put(
        `${API}/api/auth/like_this_post`,
        {
          id: id,
          adminId: admin_user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("likesd", res.data);

      setIsliked(res?.data?.likes?.includes(admin_user?._id));
      setPost(res?.data);
    } catch (err) {
      if (!admin_user) {
        navigate("/login") || navigate("/signup");
      }
      alert("like failed: " + err.response?.data?.message || err.message);
    }
  };

  // post?.likes?.includes(admin_user?._id);

  return (
    <>
      <span
        className={`pe-3 gap-1 fw-semibold d-flex align-items-center`}
        style={{ color: `${isliked ? "#d50202ff" : ""}`, width: "40px" }}
        onClick={() => {
          HandleLike(post?._id);
        }}
      >
        <span
          className={`${
            animatingBtn === "likes" ? "animate-rotate" : ""
          } rotate`}
        >
          {isliked ? <FaHeart size={size} /> : <BiHeart size={size} />}
        </span>

        <span className="" style={{ marginTop: "0.1rem" }}>
          {" "}
          {Post?.likes?.length || 0}&nbsp;
        </span>
      </span>
    </>
  );
};

export const StatusBtn = ({ post }) => {
  const { admin_user, token } = useQuote();

  const HandleStatus = async () => {
    // const [userId, setUserId] = useState(""); // use logged-in user ID
    alert("Currently status feature is not availble. . . stay tuned !");
    return;
    try {
      const res = await axios.post(
        `${API}/api/crud/create_status`,
        {
          text: post?.text,
          image: post?.images[0],
          user: admin_user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Created status:", res.data);
      alert("Status created!");
    } catch (err) {
      console.error("Error creating status:", err);
    }
  };

  return (
    <>
      <span
        className="small d-inline-flex fw-semibold text-danger"
        style={{ alignSelf: "end", cursor: "pointer", minWidth: "max-content" }}
        onClick={HandleStatus}
      >
        Set status
      </span>
    </>
  );
};
