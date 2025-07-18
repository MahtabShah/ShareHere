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
import { useTheme } from "../context/Theme";
const UserProfile = ({}) => {
  // const [OnEditMode, setOnEditMode] = useState(false);
  const nevigate = useNavigate();
  const { id } = useParams();
  const { admin_user, all_posts, all_user, mobile_break_point } = useQuote();
  // setUser(User);
  // setUser(User);
  const user = all_user?.find((u) => u?._id === id);
  // fetchUser();
  const [LazyLoading, setLazyLoading] = useState(true); // to track which button is animating

  const user_post = all_posts.filter((el) => el.userId === id);
  const [activeBtn3Profile, setActiveBtn3Profile] = useState("public");

  const FollowerPost = user_post?.filter((p) => p.mode == "Follower");
  const PaidPost = user_post?.filter((p) => p.mode == "Paid");
  const PublicPost = user_post?.filter((p) => p.mode == "public");
  console.log("god");

  // console.log("KKKK", all_posts);

  const [followMSG, setfollowMSG] = useState(false);

  const [mode, setMode] = useState();

  const { text_clrH, text_clrL, text_clrM, mainbg } = useTheme();

  useEffect(() => {
    if (user && user?.followers && admin_user) {
      const isFollower = user?.followers?.includes(admin_user?._id);

      console.log(isFollower);
      setMode(isFollower || admin_user._id == user._id ? "public" : "");
    }

    setLazyLoading(user_post.length < 0);
  }, [admin_user?.followers]);

  return (
    <>
      <div
        className="d-flex flex-column mb-5 pb-3"
        style={{
          paddingTop: `${mobile_break_point ? "50px" : "0"}`,
          background: mainbg,
        }}
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

        <div
          className="text-end pe-3 pt-3"
          style={{ height: "60px", color: text_clrH }}
        >
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
                style={{ color: text_clrH }}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div
          className="ps-3 d-flex flex-column justify-content-between"
          style={{ color: text_clrH }}
        >
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
              activeBtn3Profile === "public" ? "btn-dark" : ""
            }`}
            onClick={() => setActiveBtn3Profile("public")}
            style={{ color: text_clrH }}
          >
            Public
          </button>
          <button
            className={`btn border p-1 ps-2 pe-2 rounded-5 ${
              activeBtn3Profile === "Follower" ? "btn-dark" : ""
            }`}
            style={{ color: text_clrH }}
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
              activeBtn3Profile === "Paid" ? "btn-dark" : ""
            }`}
            onClick={() => setActiveBtn3Profile("Paid")}
            disabled={true}
            style={{ color: text_clrH }}
          >
            Paid
          </button>
        </div>

        <div className="d-flex flex-column gap-5 mt-2">
          {
            <section style={{ margin: "auto", maxWidth: "600px" }}>
              {LazyLoading ? (
                <div className="p-3 d-flex justify-content-start">
                  {" "}
                  <Loading dm={34} />
                </div>
              ) : (
                <div className="d-flex flex-column gap-5 mt-4">
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
                </div>
              )}
            </section>
          }
        </div>
        {all_posts ? (
          followMSG && (
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
          )
        ) : (
          <div className="d-flex justify-content-center vh-100 align-items-center">
            <Loading dm={32} />
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
