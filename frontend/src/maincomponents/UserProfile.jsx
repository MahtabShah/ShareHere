import React, { useState, useEffect, use } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
import { Loading } from "../../TinyComponent/LazyLoading";
import { useQuote } from "../context/QueotrContext";
import { Fragment } from "react";
import { EachPost } from "./EachPost";
import { FollowBtn } from "./EachPost";

const UserProfile = ({}) => {
  // const [OnEditMode, setOnEditMode] = useState(false);
  const nevigate = useNavigate();
  const { id } = useParams();
  const { admin_user, all_posts, all_user, mobile_break_point } = useQuote();
  // setUser(User);
  // setUser(User);
  const user = all_user?.find((u) => u?._id === id);
  // fetchUser();
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating

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
          id: id,
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

  const user_post = all_posts.filter((el) => el.userId === id);
  // console.log("user post ", id, all_user);

  const [activeBtn3Profile, setActiveBtn3Profile] = useState("public");

  const [FollowerPost, setFollowerPost] = useState([]);
  const [PaidPost, setPaidPost] = useState([]);
  const [PublicPost, setPublicPost] = useState([]);

  useEffect(() => {
    setFollowerPost(user_post?.filter((p) => p.mode == "Follower"));
    setPaidPost(user_post?.filter((p) => p.mode == "Paid"));
    setPublicPost(user_post?.filter((p) => p.mode == "public"));
  }, [all_posts]);

  // console.log("KKKK", all_posts);

  const [followMSG, setfollowMSG] = useState(false);

  const [is_i_am_follower, setIs_i_am_follower] = useState(false);
  const [mode, setMode] = useState();

  useEffect(() => {
    if (user && user?.followers && admin_user) {
      const isFollower = user?.followers?.includes(admin_user?._id);

      console.log(isFollower);
      setIs_i_am_follower(isFollower);
      setMode(isFollower || admin_user._id == user._id ? "public" : "");
    }
  }, [admin_user?.followers]);

  return (
    <>
      {admin_user && all_posts ? (
        <div
          className="d-flex flex-column bg-light text-dark border mb-5"
          style={{ marginTop: `${mobile_break_point ? "50px" : "0"}` }}
        >
          <div
            className="photoHeader w-100 position-relative border"
            style={{ height: "calc(120px + 20dvw)", maxHeight: "300px" }}
          >
            <div
              className="text-center position-absolute ps-2 overflow-hodden bg-image"
              style={{
                bottom: "calc(-50px)",
              }}
            >
              <div
                className="rounded-circle bg-image"
                style={{
                  background: user?.bg_clr,
                  minWidth: "100px",
                  minHeight: "100px",
                  background: `url(${user?.profile_pic})`,
                  aspectRatio: "1/1",
                }}
              />
            </div>
            <img
              src={user?.cover_pic}
              alt="cover"
              className="w-100 h-100"
              style={{
                objectFit: "cover",
              }}
            />
          </div>

          <div className="text-end pe-3 pt-3" style={{ height: "60px" }}>
            <div className="d-flex justify-content-end align-items-center">
              {id !== admin_user?._id && (
                <>
                  <FollowBtn
                    user={user}
                    cls={"btn btn-outline-dark btn-sm ps-2 pe-2"}
                  />
                </>
              )}

              {id === admin_user?._id && (
                <button
                  className="btn btn-outline-dark btn-sm ms-2"
                  onClick={() => {
                    nevigate(`/api/user/edit/${admin_user?._id}`);
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="ps-3 d-flex flex-column justify-content-between">
            <div className="d-flex  justify-content-between">
              <h4 className="flex-grow-1">{user?.username}</h4>
              {/* <p className="mb-1">{User?.channel_name}</p> */}
              {/* <p className="small">{User?.about_user}</p> */}
              <div className="d-flex gap-3 ps-3 pe-3 mt-">
                <span className="text-center">
                  <span>Followers</span>
                  <h5>{user?.followers?.length || 0}</h5>
                </span>
                <span className="text-center">
                  <span>Following</span>
                  <h5>{user?.following?.length || 0}</h5>
                </span>
              </div>
            </div>

            <p className="small">
              <span className="fs-6 fw-semibold">
                {user?.bio?.trim().charAt(0)}
              </span>
              {user?.bio?.trim().slice(1)}
            </p>
          </div>

          <hr className="bg-light" />
          <div className="d-flex gap-3 ps-2">
            <button
              className={`btn border p-1 ps-2 pe-2 rounded-5 ${
                activeBtn3Profile === "public" ? "btn-dark text-white" : ""
              }`}
              onClick={() => setActiveBtn3Profile("public")}
            >
              Public
            </button>
            <button
              className={`btn border p-1 ps-2 pe-2 rounded-5 ${
                activeBtn3Profile === "Follower" ? "btn-dark text-white" : ""
              }`}
              onClick={() => {
                setActiveBtn3Profile("Follower");

                if (mode != "public") {
                  setfollowMSG(true);
                }
              }}
            >
              Follower
            </button>
            <button
              className={`btn border p-1 ps-3 pe-3 rounded-5 ${
                activeBtn3Profile === "Paid" ? "btn-dark text-white" : ""
              }`}
              onClick={() => setActiveBtn3Profile("Paid")}
              disabled={true}
            >
              Paid
            </button>
          </div>

          <div className="d-flex flex-column gap-2 mt-3">
            {
              <section style={{ margin: "auto", maxWidth: "600px" }}>
                {LazyLoading ? (
                  <div className="p-3 d-flex justify-content-start">
                    {" "}
                    <Loading dm={34} />
                  </div>
                ) : (
                  <>
                    {/* {all_users?.map((u, idx) => {
                  return (
                    <Fragment key={idx}>
                      {" "}
                      {all_comments
                        ?.filter((com) => com.userId === u._id)
                        ?.map((c, indx) => {
                          return (
                            
                          );
                        })}
                    </Fragment>
                  );
                })} */}

                    {activeBtn3Profile == "public" &&
                      PublicPost?.map((ps, idx) => {
                        return (
                          <>
                            <Fragment key={idx}>
                              <EachPost user={user} comment={ps} />
                            </Fragment>
                          </>
                        );
                      })}

                    {activeBtn3Profile == "Follower" &&
                      FollowerPost?.map((ps, idx) => {
                        return (
                          <>
                            <Fragment key={idx}>
                              <EachPost user={user} comment={ps} />
                            </Fragment>
                          </>
                        );
                      })}

                    {activeBtn3Profile == "Paid" &&
                      PaidPost?.map((ps, idx) => {
                        return (
                          <>
                            <Fragment key={idx}>
                              <EachPost user={user} comment={ps} />
                            </Fragment>
                          </>
                        );
                      })}
                  </>
                )}
              </section>
            }
          </div>

          {followMSG && (
            <div
              className="position-fixed shadow-lg border d-flex flex-column justify-content-center align-items-center gap-3 p-4 bg-white rounded"
              style={{
                zIndex: 10000,
                top: "40vh",
                left: "20vw",
                height: "20vh",
                width: "60vw",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setfollowMSG(false);
                }} // <- You can define this function in your component
                className="position-absolute btn-close"
                style={{ top: "1px", right: "1px", scale: "0.6" }}
                aria-label="Close"
              ></button>

              {/* Info Text */}
              <small className="text-center">
                This is for <b>Followers only</b>. Follow{" "}
                <b>@{user?.username}</b> to access this.
              </small>

              {/* Follow Button */}
              <FollowBtn user={user} cls="btn btn-primary rounded-pill px-4" />
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex justify-content-center vh-100 align-items-center">
          <Loading dm={32} />
        </div>
      )}
    </>
  );
};

export default UserProfile;
