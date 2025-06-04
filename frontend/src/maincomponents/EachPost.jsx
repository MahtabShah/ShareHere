import { useEffect, useState, useRef, use } from "react";
import axios from "axios";
import { MdSend, MdShare } from "react-icons/md";
import { Loading } from "../../TinyComponent/LazyLoading";
import { BsThreeDotsVertical } from "react-icons/bs";
import UploadProduct from "../pages/UploadProduct";
import { FaShareAlt, FaRegComment, FaHeart } from "react-icons/fa"; // from Font Awesome
import { BiShare, BiChat, BiHeart } from "react-icons/bi";
import Carousel from "react-bootstrap/Carousel";
import Nav from "react-bootstrap/Nav";
// import { User } from "../../../backend/models/User";
import PreImages from "../../TinyComponent/PreImages";
const API = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Card } from "react-bootstrap";
import html2canvas from "html2canvas";
import { CommentSection } from "./Home";
import { useQuote } from "../context/QueotrContext";

export const EachPost = ({ user, comment, admin, isDisplayedLeftNav }) => {
  const [open_comment, setopen_comment] = useState(false);
  const [new_comment, setnew_comment] = useState("");
  const [isliked, setisliked] = useState(false);
  const [isfollowed, setisfollowed] = useState(false);
  const [animatingBtn, setAnimatingBtn] = useState(null); // to track which button is animating
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating
  const [isdotClicked, setdotClicked] = useState(false); //
  const nevigate = useNavigate();
  const containerRef = useRef();
  const [fontSize, setFontSize] = useState(16); // default px

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
      const res = await axios.put(`${API}/api/auth/like_this_post`, {
        id: id,
        isliked: !isliked,
      });
      setisliked(!isliked);
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message || err.message);
    }
  };

  const Handlecomment = (e) => {
    setnew_comment(e.target.value);
  };

  // On page load, scroll to saved position if present in URL

  const HandleShare = async () => {
    const url = new URL(window.location.href);
    const scrollY = window.scrollY || window.pageYOffset;
    url.searchParams.set("scroll", scrollY);

    const shareData = {
      title: document.title,
      text: "Check out this page!",
      url: url.toString(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // alert("Thanks for sharing!");
      } catch (err) {
        alert("Share cancelled or failed.");
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(url.toString());
        alert("URL copied to clipboard (native share not supported).");
      } catch {
        alert("Failed to copy URL.");
      }
    }
  };

  // alert(user.bg_clr);
  const token = localStorage.getItem("token");

  const optimizeImage = (url, width = 600) => {
    return url.replace("/upload/", `/upload/w_${width},f_auto,q_auto/`);
  };

  // console.log("everiy time--->", comment);

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
    try {
      setLazyLoading(true);
      const res = await axios.put(`${API}/api/auth/set_comment_this_post`, {
        headers: { Authorization: `Bearer ${token}` },
        id: id, // post ki id hai
        new_comment: new_comment,
      });
      // setisliked(!isliked);
      setnew_comment("");
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message || err.message);
    }
    setLazyLoading(!true);
  };

  const captureDivRef = useRef(null);
  const [isRefReady, setIsRefReady] = useState(true);
  const [ready_url, setReady_url] = useState("");

  // return becouse of many times img generating
  const handleCapture = async () => {
    return;
    if (!document.body.contains(captureDivRef.current)) {
      alert("Element is not attached to DOM");
      return;
    }

    const canvas = await html2canvas(captureDivRef?.current, {
      useCORS: true,
      backgroundColor: null, // preserve transparent background if needed
      scale: 2, // for higher resolution
      logging: true,
    });
    const dataURL = canvas.toDataURL("image/png");

    // Optionally upload to Cloudinary
    const formData = new FormData();
    formData.append("file", dataURL);
    formData.append("upload_preset", "page_Image"); // Replace this
    formData.append("cloud_name", "dft5cl5ra"); // Replace this

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dft5cl5ra/image/upload",
      formData
    );

    console.log("Uploaded URL:", res.data.secure_url);
    setReady_url(res.data.secure_url);
    // alert("Image uploaded at: " + res.data.secure_url);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scrollPos = params.get("scroll");
    if (scrollPos) {
      window.scrollTo(0, parseInt(scrollPos));
    }

    handleCapture();
  }, []);

  return (
    <>
      {/* comment?.text?.trim() &&  */}
      {
        <>
          <div
            className="d-flex flex-column mt-4 p-0 bg position-relative border-bottom col-md-12"
            style={{
              background: "#fafafa",
              fontSize: fontSize,
            }}
            key={comment?.text?.slice(0, -1)}
          >
            {/*--------------------- user ring and follow btn ----------------------- */}
            <div className="d-flex gap-2 align-items-center">
              <UserRing user={user} />

              <div className="d-flex flex-column pe-2">
                <FollowBtn user={user} />
                <div style={{ fontSize: "12px" }}>
                  {" "}
                  {user?.followers?.length} followers
                </div>
              </div>
            </div>

            {isRefReady && ready_url && (
              // <span onClick={handleCapture} className="btn btn-outline-danger">
              //   Convert to Image
              // </span>

              <a href={ready_url}>
                {/* <img src={ready_url} alt="" /> */}
                see post
              </a>
            )}

            <div className="w-100">
              <ul style={{ listStyle: "none" }} className="p-0 m-0">
                <div
                  className={`d-flex mt-2 m-${isDisplayedLeftNav ? "0" : "3"}`}
                  style={{ overflow: "hidden" }}
                  ref={captureDivRef}
                >
                  {comment?.pages[0]?.type && (
                    <div
                      className="p-0 position-relative w-100"
                      style={{
                        maxWidth: "600px",
                        aspectRatio: "17/17",
                        flexShrink: 0,
                        margin: "auto",
                      }}
                    >
                      <div className="w-100 h-100 bg-image">
                        {comment?.pages[0]?.type === "img" ? (
                          <img
                            // src={optimizeImage(pg.val, 400)} // 400px for mobile-friendly width
                            src={`${comment?.pages[0]?.val}`} // 400px for mobile-friendly width
                            loading="lazy"
                            className="h-100 w-100"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            className="bg-image h-100 w-100"
                            style={{ background: `${comment?.pages[0]?.val}` }}
                          />
                        )}
                      </div>

                      <div
                        className="position-absolute w-100 h-100 p-3"
                        style={{
                          top: "0",
                          wordBreak: "break-word",
                          whiteSpace: "break-spaces",
                          ...comment?.pages[0]?.pre_style,
                          background: `${comment?.pages[0]?.val}`,
                        }}
                      >
                        {comment?.pages[0]?.vibe}
                      </div>
                    </div>
                  )}
                </div>

                <li className="p-2 w-100 flex-grow-1 rounded-3 ps-3">
                  {comment && (
                    <div key={comment.text.slice(0, -1)}>{comment.text}</div>
                  )}
                </li>
              </ul>
            </div>

            <div className="p-2 border-top d-flex justify-content-between like-comment-share ms-2 me-1">
              <span
                className={`pe-3 gap-1 fw-semibold d-flex align-items-center`}
                style={{ color: `${isliked ? "#ff6600" : ""}`, width: "40px" }}
                onClick={() => {
                  HandleLike(comment._id);
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
                  {comment?.likes}&nbsp;
                </span>
              </span>
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
                      background: `${admin?.bg_clr}`,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      nevigate(`/api/user/${admin._id}`);
                    }}
                  >
                    <span>{user?.username.charAt(0).toUpperCase()}</span>
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
                      SubmitComment(e, comment._id);
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

const UserRing = ({ user, style = { borderEndEndRadius: "0" } }) => {
  const nevigate = useNavigate();
  return (
    <>
      <div className="d-flex gap-2 flex-grow-1">
        <div
          className="d-flex align-items-center w-100 justify-content-center rounded-crcle text-white"
          style={{
            maxWidth: "40px",
            height: "40px",
            borderRadius: "20px",
            background: `${user.bg_clr}`,
            cursor: "pointer",
            ...style,
          }}
          onClick={() => {
            nevigate(`/api/user/${user._id}`);
          }}
        >
          <div>{user?.username?.charAt(0).toUpperCase()}</div>
        </div>

        <div className=" d-flex flex-column small align-item">
          <small
            className="small on-hover-userid"
            onClick={() => {
              nevigate(`/api/user/${user._id}`);
            }}
          >
            @{user?.username}
          </small>
          <small className="small">{user?.bio?.slice(0, 54)} . . .</small>
        </div>
      </div>
    </>
  );
};

const FollowBtn = ({ user }) => {
  const { admin_user, fetch_admin_user } = useQuote();
  const token = localStorage.getItem("token");
  const [isfollowed, setisfollowed] = useState(false);

  // fetch_admin_user();

  console.log("admin_user is working....", admin_user);
  const HandleFollow = async () => {
    // alert("followed.... start 95 home.js");
    try {
      setisfollowed(!isfollowed);
      const res = await axios.put(
        `${API}/api/crud/crud_follow_post`,
        {
          id: user._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.log(
        "folloing failed: " + err.response?.data?.message || err.message
      );
    }
  };
  return (
    <>
      {admin_user?._id !== user?._id &&
        !user?.followers?.includes(admin_user?._id) && (
          <div
            className="btn text-primary rounded-0 p-0"
            onClick={HandleFollow}
          >
            Follow
          </div>
        )}
    </>
  );
};

const SlipDotinPost = ({ user, post }) => {
  const token = localStorage.getItem("token");
  const [isfollowed, setisfollowed] = useState(false);
  const HandleFollow = async () => {
    // alert("followed.... start 95 home.js");
    try {
      setisfollowed(!isfollowed);
      const res = await axios.put(
        `${API}/api/crud/crud_follow_post`,
        {
          // data you want to send
          id: user._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // setisliked(!isliked);
    } catch (err) {
      alert("folloing failed: " + err.response?.data?.message || err.message);
    }
  };

  const HandleDelete = async () => {
    // animateButton("likes");

    const condition = window.confirm("want to delete............");

    if (condition) {
      try {
        const res = await axios.delete(`${API}/api/crud/crud_delete_post`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: post._id }, // pass id inside `data`
        });
        // setisliked(!isliked);
      } catch (err) {
        alert("Login failed: " + err.response?.data?.message || err.message);
      }
    }
    // alert("deleted..............");
  };

  const { admin_user, fetch_admin_user } = useQuote();
  return (
    <>
      <Nav.Link href="/home">Home</Nav.Link>
      <Nav.Link href="/home">Visit Post</Nav.Link>
      {admin_user?._id !== user?._id && (
        <Nav.Link onClick={HandleFollow}>
          {user?.followers?.includes(admin_user?._id) ? "Unfollow" : "follow"}
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
    </>
  );
};
