import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MdSend } from "react-icons/md";
import { Loading } from "../../TinyComponent/LazyLoading";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart } from "react-icons/fa"; // from Font Awesome
import { BiShare, BiChat, BiHeart, BiFontFamily } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import Nav from "react-bootstrap/Nav";
import { useNavigate } from "react-router-dom";
import { CommentSection } from "./Home";
import ReportPost from "../../TinyComponent/Report";
import { useQuote } from "../context/QueotrContext";
import follow_us from "/src/assets/follow-us.png";
const API = import.meta.env.VITE_API_URL || "";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { usePost } from "../context/PostContext";
import { useTheme } from "../context/Theme";
import React from "react";
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

export const EachPost = ({ user, each_post }) => {
  const [open_comment, setopen_comment] = useState(false);
  const [new_comment, setnew_comment] = useState("");
  const [LazyLoading, setLazyLoading] = useState(false);
  const [isdotClicked, setdotClicked] = useState(false);
  const [comments, setComments] = useState(each_post?.comments || []); // store comments here
  const nevigate = useNavigate();
  const [mode, setMode] = useState(each_post?.mode);

  const { admin_user, token, HandleShare, mobile_break_point } = useQuote();
  const postId = each_post?._id;

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
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setComments(res?.data?.comments); // append new each_post instantly
      setnew_comment("");
    } catch (err) {
      alert("each_post failed: " + err.response?.data?.message || err.message);
    }
    setLazyLoading(false);
  };

  useEffect(() => {
    if (user && user?.followers && admin_user) {
      const isFollower = user?.followers?.includes(admin_user?._id);
      setMode(
        isFollower || admin_user?._id == user?._id ? "Public" : each_post?.mode,
      );
    }
  }, [admin_user?.followers]);

  const { textSecondary, textMuted, bgCard, bgPage, borderColor } = useTheme();
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
      const isTruncated = each_post?.text.split("\n").length > 3;
      setShouldTruncate(isTruncated);
    }
  }, [each_post?.text]);

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
    console.log(each_post);
  }, [postId]);

  const [report, setReport] = useState(false);

  return (
    <div
      className="w-100 d-flex flex-column gap-3 p-3"
      ref={seenRef}
      style={{
        maxWidth: "520px",
        placeSelf: "center",
        background: bgCard,
        position: "relative",
      }}>
      <PostHeader user={user} admin_user={admin_user} each_post={each_post} />

      <div className="d-flex borde r flex-column gap-2">
        <div
          className="overflow-hidden w-100 rounded-2"
          style={{
            maxWidth: "440px",
            alignSelf: "center",
          }}>
          {mode == "Public" && (
            <img
              loading="lazy"
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
              src={each_post?.images[0] || ""}
            />
          )}

          {mode == "Follower" && (
            <div
              className={`d-flex align-items-center flex-column h-100`}
              style={{ background: textMuted }}>
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
                <b>@{user?.username}</b> to access this post.
              </p>
            </div>
          )}

          <div
            className="pb- 2"
            style={{
              color: textSecondary,
            }}>
            {each_post && (
              <div
                className="pt-3 d-flex b order position-relative"
                style={{
                  overflow: "hidden",
                  transition: "height 0.3s ease",
                }}>
                <div ref={contentRef} className="flex-gr ow-1 text-ce nter">
                  {each_post?.text.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {1 < index && (index <= 2 ? <br /> : expanded && <br />)}
                      {index <= 2 ? <>{line}</> : expanded && <>{line}</>}
                    </React.Fragment>
                  ))}
                </div>

                {shouldTruncate && (
                  <span
                    onClick={() => setExpanded(!expanded)}
                    aria-expanded={expanded}
                    className="fw-semibold position- px-1 pt-1 rounded"
                    style={{
                      color: "var(--accent-color)",
                      cursor: "pointer",
                      placeSelf: "end",
                      right: 0,
                      minWidth: "max-content",
                    }}>
                    {expanded ? ". . . less" : ". . . more"}
                  </span>
                )}
              </div>
            )}
          </div>

          <div
            className={`d-flex gap-1 py-2 justify-content-between like-comment-share`}
            style={{
              color: textSecondary,
            }}>
            <div
              className="d-flex gap-3 rounded-5"
              style={{ minWidth: "max-content" }}>
              <LikeBtn post={each_post} size={25} />
              <span
                className="fw-semibold d-flex align-items-center gap-1"
                onClick={() => setopen_comment(!open_comment)}>
                <span
                  style={{
                    marginBottom: "1px",
                    color: open_comment ? "var(--accent-color)" : "",
                  }}>
                  <FaRegComment
                    size={22}
                    color={open_comment ? "var(--accent-color)" : ""}
                  />{" "}
                  {comments.length > 0 && (
                    <small>{comments.length}&nbsp;</small>
                  )}
                </span>
              </span>
              <span
                className="fw-semibold ms-1 ps-1"
                onClick={() => HandleShare(each_post?._id)}
                style={{ marginTop: "1px" }}>
                <BiShare size={25} />
              </span>
            </div>

            <div className="d-flex position-relative gap-1 align-items-center">
              {/* <span
            className="me-2"
            style={{ color: textSecondary, fontSize: "12px" }}>
            {formatNumber(each_post?.views || 1)} views
          </span>

          <div
            className="small px-2 rounded-4"
            style={{
              fontSize: "12px",
              background: bgPage,
              border: `1px solid ${borderColor}`,
            }}>
            <small className="p-2">
              {each_post?.category &&
                each_post.category.charAt(0).toUpperCase() +
                  each_post.category.slice(1)}
            </small>
          </div> */}

              <div
                className="d-flex position-relative"
                onClick={() => {
                  setdotClicked(!isdotClicked);
                  if (report) setReport(false);
                }}
                style={{
                  rotate: isdotClicked ? "360deg" : "",
                  transitionDuration: "0.3s",
                  translate: mobile_break_point ? "4px" : "7px",
                }}>
                <BsThreeDotsVertical size={20} />
              </div>

              {isdotClicked && (
                <div
                  className={`small fw-medium w-100 rounded-2 d-flex flex-column p-3 gap-3`}
                  style={{
                    color: textSecondary,
                    position: "absolute",
                    bottom: "0",
                    right: "20px",
                    minWidth: "200px",
                    background: bgPage,
                    border: "1px solid var(--border-color)",
                  }}>
                  <SlipDotinPost
                    user={user}
                    post={each_post}
                    report={report}
                    setReport={setReport}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {report && <ReportPost postId={each_post?._id} />}

      {/* each_post box */}
      <section
        className="pt-3"
        style={{
          color: textSecondary,
          borderTop: `1px solid var(--border-color)`,
        }}>
        {(admin_user?._id != user?._id || open_comment) && (
          <div className="d-flex flex-column position-relative mb-3">
            <div className="d-flex gap-1">
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
                onClick={() => nevigate(`/api/user/${admin_user?._id}`)}>
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
                  background: "none",
                  color: textSecondary,
                }}
              />

              <div className="d-flex gap-3" style={{ alignSelf: "end" }}>
                <button
                  className="btn border-0 p-1 ps-3 pe-0 rounded-0"
                  onClick={(e) => SubmitComment(e, each_post?._id)}>
                  {LazyLoading ? (
                    <Loading clr={"red"} />
                  ) : (
                    <MdSend size={22} color={textSecondary} />
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
  const { textPrimary, textSecondary } = useTheme();
  const { setopenSlidWin } = useQuote();

  const displayName = user?.username || user?.name || "user";
  const userPhoto = user?.profile_pic || user?.dp || "";
  const initial = (displayName?.charAt(0) || "U").toUpperCase();
  const bgColor = user?.bg_clr || "var(--accent-primary, #e1306c)";

  const handleProfileClick = (e) => {
    e?.stopPropagation();
    if (user?._id) {
      setopenSlidWin(false);
      nevigate(`/api/user/${user._id}`);
    }
  };

  return (
    <>
      <div className="d-flex gap-2  flex-grow-1 align-items-center">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle overflow-hidden vibe-ring border flex-shrink-0"
          style={{
            width: `${dm}px`,
            height: `${dm}px`,
            maxWidth: `${dm}px`,
            minWidth: `${dm}px`,
            background: bgColor,
            cursor: user?._id ? "pointer" : "default",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: `${Math.round(dm * 0.4)}px`,
            ...style,
          }}
          onClick={handleProfileClick}>
          {userPhoto ? (
            <img
              src={userPhoto}
              alt={displayName}
              className="h-100 w-100"
              style={{
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        {!onlyphoto && (
          <div
            className="d-flex flex-column small overflow-hidden"
            style={{ color: textSecondary }}>
            <small
              className="small fw-medium on-hover-userid text-truncate"
              onClick={handleProfileClick}
              style={{
                cursor: user?._id ? "pointer" : "default",
                color: textPrimary,
              }}>
              @
              {user?.username
                ? user.username
                : displayName.replace(/\s+/g, "").toLowerCase()}
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
                }}>
                {user.bio}
              </small>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const PostHeader = ({ user, admin_user, each_post }) => {
  return (
    <div className="d-flex align-items-center justify-content-between p-1">
      <div className="flex-grow-1">
        <UserRing user={user} />
      </div>

      <div className="text-end" style={{ minWidth: "max-content" }}>
        {user?._id !== admin_user?._id && <FollowBtn id={user?._id} />}
        {user?._id === admin_user?._id && <StatusBtn post={each_post} />}

        <div
          className="d-flex gap-2"
          style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          <small>{user?.followers?.length} followers</small>
          <small style={{ color: "var(--text-secondary)" }}>
            {dayjs(each_post?.createdAt).fromNow()}
          </small>
        </div>
      </div>
    </div>
  );
};

/**
 * NOTE: Always ensure that when you use FollowBtn, you pass the latest user object
 * (with up-to-date followers array) as a prop, and update it in the parent component
 * when the follow status changes. This ensures the FollowBtn reflects the correct state.
 * we can also fetch letest user by its id in follow btn, ok next time In Sha Allah
 */

export const FollowBtn = ({ id, cls = "text-primary", style = {} }) => {
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
        { headers: { Authorization: `Bearer ${token}` } },
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
          className={`${cls} fw-medium`}
          onClick={handleClick}
          style={{ ...style, minWidth: "max-content", cursor: "pointer" }}
          aria-readonly={true}>
          {isFollower ? "Unfollow" : "Follow"}
        </div>
      )}
    </>
  );
};

export const SlipDotinPost = ({ user, post, report, setReport }) => {
  const { admin_user, token } = useQuote();

  const HandleDelete = async () => {
    const condition = window.confirm("want to delete the post");

    if (condition) {
      try {
        const res = await axios.delete(`${API}/api/crud/crud_delete_post`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: post?._id }, // pass id inside `data`
        });
        // setisliked(!isliked);
      } catch (err) {
        console.log(
          "deleteing failed: " + err.response?.data?.message || err.message,
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
          <Nav.Link onClick={HandleDelete} className="text-danger">
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
        }}>
        Report
      </Nav.Link>
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
    post?.likes?.includes(admin_user?._id),
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
        },
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
        }}>
        <span
          className={`${
            animatingBtn === "likes" ? "animate-rotate" : ""
          } rotate`}>
          {isliked ? <FaHeart size={size} /> : <BiHeart size={size} />}
        </span>

        {Post?.likes?.length > 0 && (
          <small className="" style={{ marginTop: "1px" }}>
            {Post?.likes?.length}&nbsp;
          </small>
        )}
      </span>
    </>
  );
};

export const StatusBtn = ({ post }) => {
  const { admin_user, token } = useQuote();

  const HandleStatus = async () => {
    // const [userId, setUserId] = useState(""); // use logged-in user ID
    // alert("Currently status feature is not availble. . . stay tuned !");
    // return;
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
        },
      );
      admin_user?.status.push(res?.data);
      console.log("Created status:", admin_user);

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
        onClick={HandleStatus}>
        Add Story
      </span>
    </>
  );
};
