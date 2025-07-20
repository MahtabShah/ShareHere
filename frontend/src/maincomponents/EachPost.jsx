// ----------------------------------Done------------------------------------

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MdSend } from "react-icons/md";
import { Loading } from "../../TinyComponent/LazyLoading";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart } from "react-icons/fa"; // from Font Awesome
import { BiShare, BiChat, BiHeart } from "react-icons/bi";
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

import { useTheme } from "../context/Theme";

export const EachPost = ({ user, comment }) => {
  // comment parameter is besiaclly post
  const [open_comment, setopen_comment] = useState(false);
  const [new_comment, setnew_comment] = useState("");
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating
  const [isdotClicked, setdotClicked] = useState(false); //
  const nevigate = useNavigate();
  const containerRef = useRef();
  const [fontSize, setFontSize] = useState(16); // default px

  const { admin_user, HandleShare, isDisplayedLeftNav, mobile_break_point } =
    useQuote();

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;

        // Scale logic: font size = width / 20, clamp it
        const newFontSize = Math.min(Math.min(width / 30)); // min 12px, max 36px
        setFontSize(newFontSize);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const Handlecomment = (e) => {
    setnew_comment(e.target.value);
  };

  // On page load, scroll to saved position if present in URL

  const token = localStorage.getItem("token");

  const optimizeImage = (url, width = 600) => {
    return url.replace("/upload/", `/upload/w_${width},f_auto,q_auto/`);
  };

  const { search } = useLocation();
  const postId = new URLSearchParams(search).get("postId");

  useEffect(() => {
    if (postId) {
      const el = document.getElementById(postId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.style.backgroundColor = "#ffffcc"; // highlight
        setTimeout(() => {
          el.style.backgroundColor = "transparent"; // remove after delay
        }, 2000);
      }
    }
  }, [postId]);

  const SubmitComment = async (e, id) => {
    e.preventDefault();
    // console.log("form comment ------> ", new_comment);
    if (!admin_user) {
      nevigate("/login") || nevigate("/signup");
      return;
    }
    try {
      setLazyLoading(true);
      const res = await axios.put(
        `${API}/api/auth/set_comment_this_post`,
        {
          id: id, // post ki id hai
          new_comment: new_comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // setisliked(!isliked);
      setnew_comment("");
    } catch (err) {
      alert("comment failed: " + err.response?.data?.message || err.message);
    }
    setLazyLoading(!true);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scrollPos = params.get("scroll");
    if (scrollPos) {
      window.scrollTo(0, parseInt(scrollPos));
    }
  }, []);

  // console.log("userrr", user, "and", comment);

  const [is_i_am_follower, setIs_i_am_follower] = useState(false);
  const [mode, setMode] = useState(comment?.mode);

  useEffect(() => {
    if (user && user?.followers && admin_user) {
      const isFollower = user?.followers?.includes(admin_user?._id);

      console.log(isFollower);
      setIs_i_am_follower(isFollower);
      setMode(
        isFollower || admin_user?._id == user?._id ? "public" : comment?.mode
      );
    }
  }, [admin_user?.followers]);

  const { text_clrH, text_clrL, text_clrM, mainbg } = useTheme();

  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("4.5"); // approx 1 lines height
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
      const isTruncated = el.scrollHeight > el.clientHeight + 1; // buffer for sub-pixel rounding
      setShouldTruncate(isTruncated);
    }
  }, [comment.text]);

  return (
    <div
      className={`pb-1 ${mobile_break_point ? "" : "p-2"}`}
      style={{ borderBottom: `1px solid ${text_clrL}` }}
    >
      <div
        className="d-flex flex-column gap-2 position-relative bglight"
        key={comment?._id}
        style={{ background: mainbg }}
      >
        {/*--------------------- user ring and follow btn ----------------------- */}
        <div
          className={`d-flex gap-2 align-items-center pt-2 justify-content-between flex-grow-1 ${
            mobile_break_point ? "pe-2 ps-2" : ""
          }`}
        >
          <div className="d-flex flex-grow-1">
            <UserRing user={user} />
          </div>

          <div
            className="d-flex flex-column justify-content-start align-items-end"
            style={{ minWidth: "max-content" }}
          >
            {user?._id !== admin_user?._id && (
              <FollowBtn
                user={user}
                cls="rounded-0 small pe-0 text-primary border-0"
                style={{ fontSize: "14px", cursor: "pointer" }}
              />
            )}

            {user?._id === admin_user?._id && (
              <div className="small">
                <StatusBtn post={comment} />
              </div>
            )}
            <div
              className="d-flex gap-2"
              style={{ fontSize: "12px", color: text_clrM }}
            >
              <small style={{ color: text_clrM }}>
                {dayjs(comment?.createdAt).fromNow()}
              </small>
              <small>{user?.followers?.length} followers</small>
            </div>
          </div>
        </div>

        {/* ---------------------------- post img ------------------------------------ */}

        <div className="">
          <ul style={{ listStyle: "none" }} className="p-0 m-0">
            <div
              className={`d-flex align-items-center`}
              style={{
                overflow: "hidden",
                // background: mode == "public" ? "" : "#ddd",
              }}
            >
              <div
                className="p-0 w-100 position-relative"
                // style={{ border: "1px solid red" }}
              >
                <div
                  className="bg-image d-flex align-items-center flex-column"
                  // style={{ border: `1px solid ${text_clrL}` }}
                >
                  {mode == "public" && (
                    <img
                      src={`${comment?.images[0]}`}
                      loading="lazy"
                      className={`w-100 h-100 rounded-${
                        mobile_break_point ? "0" : "1"
                      }`}
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  )}

                  {mode == "Follower" && (
                    <div
                      className={`d-flex align-items-center flex-column h-100  rounded-${
                        mobile_break_point ? "0" : "1"
                      }`}
                      style={{ background: text_clrM }}
                    >
                      <div style={{ width: "180px" }}>
                        <img
                          src={follow_us}
                          alt=""
                          className={`h-100 w-100`}
                          style={{
                            objectFit: "cover",
                            opacity: "0.4",
                          }}
                        />
                      </div>
                      <p className="p-2 fs-5">
                        This is for <b>Followers only</b>. Follow{" "}
                        <b>@{user?.username}</b> to access this.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <li
              className={`w-100 flex-grow-1 d-flex rounded-3 mt-2 ${
                mobile_break_point ? "pe-2 ps-2" : ""
              }`}
              style={{ color: text_clrM }}
            >
              {comment && (
                <>
                  <div
                    key={comment.text}
                    className="w-100"
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
                        className=""
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
                </>
              )}
            </li>
          </ul>
        </div>

        <div
          className={`d-flex py-2 justify-content-between like-comment-share  ${
            mobile_break_point ? "pe- ps-2" : ""
          }`}
          style={{ color: text_clrM }}
        >
          <div className="d-flex gap-4">
            {/* <div style={{ translate: "-1px 1px" }}> */}
            <LikeBtn post={comment} size={28} />
            {/* </div> */}
            <span
              className="fw-semibold d-flex align-items-center gap-1"
              onClick={() => {
                setopen_comment(!open_comment);
              }}
            >
              <span
                style={{
                  marginTop: "0.2rem",
                  color: open_comment ? "#ed5" : "",
                }}
              >
                <BiChat size={28} color={open_comment ? "#ed5" : ""} />{" "}
                {comment?.comments?.length || 0}&nbsp;
              </span>
            </span>
            <span className="fw-semibold" onClick={HandleShare}>
              <BiShare size={28} />
            </span>
          </div>

          <span
            onClick={() => {
              setdotClicked(!isdotClicked);
            }}
            className=""
            style={{
              rotate: isdotClicked ? "-45deg" : "",
              translate: mobile_break_point ? "0px" : "7px",
            }}
          >
            <BsThreeDotsVertical size={22} />
          </span>
        </div>
      </div>
      {isdotClicked && (
        <div
          className={`small fw-medium d-flex flex-wrap gap-3 my-2 ${
            mobile_break_point ? "ps-2 pe-2" : ""
          }`}
          style={{ color: text_clrM }}
        >
          <SlipDotinPost user={user} post={comment} />
        </div>
      )}
      {admin_user?._id != user?._id && (
        <section
          className={`${mobile_break_point ? "ps-2 pe-2" : ""}`}
          style={{ background: mainbg, color: text_clrM }}
        >
          <div className="gap-1 pt-2 d-flex flex-column position-relative">
            <div className="d-flex gap-1 pb-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-crcle text-white me-2  overflow-hidden"
                style={{
                  minWidth: "40px",
                  maxWidth: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: `${admin_user?.bg_clr || "#2a1"}`,
                  cursor: "pointer",
                }}
                onClick={() => {
                  nevigate(`/api/user/${admin_user?._id}`);
                }}
              >
                {(
                  <img
                    src={admin_user?.profile_pic}
                    className="h-100 w-100"
                    style={{ objectFit: "cover" }}
                  />
                ) || "#!"}
              </div>

              <textarea
                required
                className="w-100 shadow-none border-0 rounded-0 ps-0 mt-2 fs-0 small"
                placeholder="Write your sentence here . . . . . ."
                onChange={(e) => {
                  Handlecomment(e);
                }}
                onInput={(e) => {
                  e.target.style.height = "30px"; // reset height
                  e.target.style.height = `${e.target.scrollHeight}px`; // set new height
                }}
                value={new_comment || ""}
                style={{
                  marginTop: "0.1rem",
                  background: mainbg,
                  color: text_clrM,
                }}
              />

              <div
                className="d-flex gap-3"
                style={{ alignSelf: "end", bottom: "0.5rem" }}
              >
                {/* <button
                      className="btn btn-outline-dark ps-3 pe-3 p-1 rounded-0"
                      style={{ alignSelf: "end", bottom: "0.5rem" }}
                      onClick={(e) => {
                        setopen_comment(!open_comment);
                      }}
                    >
                      Cancel
                    </button> */}

                <button
                  className="btn border-0 p-1 ps-3 pe-0 rounded-0"
                  onClick={(e) => {
                    SubmitComment(e, comment?._id);
                  }}
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
          {open_comment && (
            <div
              className="pt-2"
              style={{
                borderBottom: `${open_comment ? `0px solid ${text_clrL}` : ""}`,
              }}
            >
              <CommentSection post={comment} />
            </div>
          )}
        </section>
      )}
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

export const FollowBtn = ({ user, cls, style = {} }) => {
  const { admin_user, followersMap, toggleFollowStatus, token } = useQuote();
  const [isFollowed, setIsFollowed] = useState(
    user?.followers?.includes(admin_user?._id)
  );

  const { text_clrH, text_clrL, text_clrM } = useTheme();

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      // Flip follow status locally first

      // API call
      await axios.put(
        `${API}/api/crud/crud_follow_post`,
        { id: user?._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      if (!admin_user) {
        navigate("/login") || navigate("/signup");
      }

      console.error("Error updating follow status:", err);
      // Revert back on error
    }
  };

  useEffect(() => {
    const isFollowed = user?.followers?.includes(admin_user?._id);
    setIsFollowed(isFollowed);
    console.log("isfollows", isFollowed);
  }, [user]);

  // if (admin_user?._id === user?._id) return null;

  return (
    <div
      className={cls}
      onClick={handleClick}
      style={{ ...style, minWidth: "max-content", color: text_clrH }}
    >
      {isFollowed ? "Unfollow" : "Follow"}
    </div>
  );
};

export const SlipDotinPost = ({ user, post }) => {
  const token = localStorage.getItem("token");
  const [report, setReport] = useState(false);

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

  const { admin_user, fetch_admin_user } = useQuote();
  return (
    <>
      <Nav.Link href="/home">Home</Nav.Link>
      <Nav.Link href={`/home/${post._id}`}>Visit Post</Nav.Link>
      {admin_user?._id !== user?._id && (
        <Nav.Link>
          <FollowBtn user={user} cls="" />
        </Nav.Link>
      )}
      {post?.userId === admin_user?._id ? (
        // this way is just for temporary...!!!

        <>
          <Nav.Link href="/home">Edit Post</Nav.Link>
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
  const [animatingBtn, setAnimatingBtn] = useState(null); // to track which button is animating
  const token = localStorage.getItem("token");
  const { admin_user } = useQuote();
  const navigate = useNavigate();

  // Handle animation on click
  const animateButton = (btnName) => {
    setAnimatingBtn(btnName);
    setTimeout(() => {
      setAnimatingBtn(null);
    }, 400); // duration of animation
  };

  const HandleLike = async (id) => {
    animateButton("likes");
    try {
      await axios.put(
        `${API}/api/auth/like_this_post`,
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      if (!admin_user) {
        navigate("/login") || navigate("/signup");
      }
      alert("like failed: " + err.response?.data?.message || err.message);
    }
  };

  const isliked = post?.likes?.includes(admin_user?._id);

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
          {post?.likes?.length}&nbsp;
        </span>
      </span>
    </>
  );
};

export const StatusBtn = ({ post }) => {
  const { admin_user, token } = useQuote();

  const HandleStatus = async () => {
    // const [userId, setUserId] = useState(""); // use logged-in user ID
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
