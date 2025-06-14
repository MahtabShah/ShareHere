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
import { useQuote } from "../context/QueotrContext";

const API = import.meta.env.VITE_API_URL;

export const EachPost = ({ user, comment }) => {
  // comment parameter is besiaclly post
  const [open_comment, setopen_comment] = useState(false);
  const [new_comment, setnew_comment] = useState("");
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating
  const [isdotClicked, setdotClicked] = useState(false); //
  const nevigate = useNavigate();
  const containerRef = useRef();
  const [fontSize, setFontSize] = useState(16); // default px

  const { admin_user, HandleShare, isDisplayedLeftNav } = useQuote();

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

  return (
    <>
      {
        <>
          <div
            className="d-flex flex-column p-0 bg position-relative border-bottom"
            style={{
              background: "#faf8f9",
              fontSize: fontSize,
            }}
            key={comment?._id}
          >
            {/*--------------------- user ring and follow btn ----------------------- */}
            <div className="d-flex gap-2 ps-1 mt-1 align-items-center">
              <UserRing user={user} />

              <div className="d-flex flex-column align-items-end">
                {user?._id !== admin_user?._id && (
                  <FollowBtn
                    user={user}
                    cls="btn ps-2 pe-2 me-2 rounded-0 small"
                    style={{ fontSize: "14px" }}
                  />
                )}
                {user?._id === admin_user?._id && (
                  <div className="pe-3 small">
                    <StatusBtn post={comment} />
                  </div>
                )}
                <div className="pe-3" style={{ fontSize: "12px" }}>
                  {user?.followers?.length} followers
                </div>
              </div>
            </div>

            <div className="w-100">
              <ul style={{ listStyle: "none" }} className="p-0 m-0">
                <div
                  className={`d-flex mt-2 m-${isDisplayedLeftNav ? "0" : "1"}`}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="p-0 position-relative w-100"
                    style={{
                      maxWidth: "600px",
                      aspectRatio: "6/7",
                      flexShrink: 0,
                      margin: "auto",
                    }}
                  >
                    <div className="w-100 h-100 bg-image">
                      <img
                        // src={optimizeImage(pg.val, 400)} // 400px for mobile-friendly width
                        src={`${comment?.images[0]}`} // 400px for mobile-friendly width
                        loading="lazy"
                        className="h-100 w-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                </div>

                <li className="p-2 w-100 flex-grow-1 rounded-3 ps-3">
                  {comment && (
                    <div key={comment.text.slice(0, -1)}>{comment.text}</div>
                  )}
                </li>
              </ul>
            </div>

            <div className="p-2 border-top d-flex justify-content-between like-comment-share ms-2 me-1">
              <LikeBtn post={comment} />
              <span
                className="ps-3 pe-3 p-1 fw-semibold d-flex align-items-center gap-1"
                onClick={() => {
                  setopen_comment(!open_comment);
                }}
              >
                <span style={{ marginTop: "0.2rem" }}>
                  <BiChat /> {comment?.comments?.length || 0}&nbsp;
                </span>
              </span>
              <span className="ps-2 p-1 fw-semibold" onClick={HandleShare}>
                <BiShare />
              </span>

              <span
                onClick={() => {
                  setdotClicked(!isdotClicked);
                }}
              >
                <BsThreeDotsVertical size={16} />
              </span>
            </div>
          </div>
          {isdotClicked && (
            <div
              className="small fw-medium d-flex flex-wrap p-3 gap-3"
              style={{
                background: "#ddf",
              }}
            >
              <SlipDotinPost user={user} post={comment} />
            </div>
          )}
          {open_comment && (
            <section
              className="ps-3"
              style={{ background: "#ddf", borderTop: "1px solid #bbd" }}
            >
              <div
                className="gap-1 border-top-0 border-bottom-0 d-flex flex-column position-relative"
                style={{ background: "#ddf" }}
              >
                <div className="d-flex mt-3 gap-1">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-crcle text-white me-2"
                    style={{
                      minWidth: "30px",
                      height: "30px",
                      borderRadius: "20px",
                      background: `${admin_user?.bg_clr}`,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      nevigate(`/api/user/${admin_user?._id}`);
                    }}
                  >
                    <span>{admin_user?.username.charAt(0).toUpperCase()}</span>
                  </div>

                  <textarea
                    required
                    className="w-100 shadow-none border-0 border-bottom rounded-0 ps-0 pt-1 fs-0 small"
                    placeholder="Write your sentence here . . . . . ."
                    onChange={(e) => {
                      Handlecomment(e);
                    }}
                    onInput={(e) => {
                      e.target.style.height = "30px"; // reset height
                      e.target.style.height = `${e.target.scrollHeight}px`; // set new height
                    }}
                    value={new_comment || ""}
                    style={{ marginTop: "0.1rem", background: "#ddf" }}
                  />
                </div>
                <div
                  className="d-flex gap-3 p-2"
                  style={{ alignSelf: "end", bottom: "0.5rem" }}
                >
                  <button
                    className="btn btn-outline-dark ps-3 pe-3 p-1 rounded-0"
                    style={{ alignSelf: "end", bottom: "0.5rem" }}
                    onClick={(e) => {
                      setopen_comment(!open_comment);
                    }}
                  >
                    Cancel
                    {/* <MdCancel size={20} /> */}
                  </button>

                  <button
                    className="btn btn-outline-danger p-1 d-flex align-items-center ps-3 pe-3 me-1 rounded-0"
                    onClick={(e) => {
                      SubmitComment(e, comment?._id);
                    }}
                  >
                    {LazyLoading ? (
                      <Loading clr={"light"} />
                    ) : (
                      <MdSend size={20} />
                    )}
                  </button>
                </div>
              </div>

              <CommentSection post={comment} />
            </section>
          )}
        </>
      }
    </>
  );
};

export const UserRing = ({ user, style = { borderEndEndRadius: "0" } }) => {
  const nevigate = useNavigate();
  return (
    <>
      <div className="d-flex gap-2 flex-grow-1 align-items-center">
        <div
          className="d-flex align-items-center w-100 justify-content-center rounded-crcle text-white overflow-hidden vibe-ring"
          style={{
            maxWidth: "40px",
            height: "40px",
            background: `${user?.bg_clr}`,
            cursor: "pointer",
            ...style,
          }}
          onClick={() => {
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
                maxWidth: "40px",
                minHeight: "40px",
              }}
            />
          </div>
        </div>

        <div className=" d-flex flex-column small align-item">
          <small
            className="small on-hover-userid"
            onClick={() => {
              nevigate(`/api/user/${user?._id}`);
            }}
          >
            @{user?.username}
          </small>
          <small className="small">{user?.bio?.slice(0, 24)} . . . .</small>
        </div>
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
      style={{ ...style, minWidth: "max-content" }}
    >
      {isFollowed ? "Unfollow" : "Follow"}
    </div>
  );
};

export const SlipDotinPost = ({ user, post }) => {
  const token = localStorage.getItem("token");

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
      <Nav.Link href="/home">Visit Post</Nav.Link>
      {admin_user?._id !== user?._id && (
        <Nav.Link>
          <FollowBtn user={user} cls="" />
        </Nav.Link>
      )}
      {post?.userId === admin_user?._id ||
      "683ca60f4d22f430952c6d01" === admin_user?._id ? (
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
      <Nav.Link href="#" className="text-danger">
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
    </>
  );
};

export const LikeBtn = ({ post }) => {
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
        style={{ color: `${isliked ? "#ff6600" : ""}`, width: "40px" }}
        onClick={() => {
          HandleLike(post?._id);
        }}
      >
        <span
          className={`${
            animatingBtn === "likes" ? "animate-rotate" : ""
          } rotate`}
        >
          {isliked ? <FaHeart /> : <BiHeart />}
        </span>

        <span className="" style={{ marginTop: "0.26rem" }}>
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
