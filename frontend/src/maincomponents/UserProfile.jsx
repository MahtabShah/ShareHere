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
  const { admin_user, all_posts, all_user } = useQuote();
  // setUser(User);
  // setUser(User);
  const user = all_user?.find((u) => u?._id === id);
  // fetchUser();
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating

  const token = localStorage.getItem("token");

  // console.log("UserProfile component User:", user, id, admin_user);

  // const onEditMode = () => {
  //   // setOnEditMode(!OnEditMode)
  //   // nevigate(`/user/EditProfile/${User.id}`);
  // };

  // const HandelFollower = async () => {
  //   // try {
  //   //   await axios
  //   //     .put("http://localhost:3000/api/followed", {
  //   //       userId: User?.id,
  //   //     })
  //   //     .then((res) => {
  //   //       console.log("follower UserProfile at line: 31 component", res.data);
  //   //       setUser(res.data);
  //   //       fetchUser();
  //   //     });
  //   // } catch (error) {
  //   //   console.error("❌ Error updating follower:", error);
  //   // }
  // };
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
  console.log("user post ", id, all_user);

  return (
    <div
      className="d-flex flex-column bg-light text-dark border mb-5"
      style={{ maxWidth: "600px", margin: "auto" }}
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
            className="rounded-circle"
            style={{
              background: user?.bg_clr,
              minWidth: "100px",
              minHeight: "100px",
              background: `url(${user?.profile_pic})`,
              aspectRatio: "1/1",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
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
      <h4 className="ps-2">Vibes share by @{user?.username}</h4>

      {/* <div
        className="d-grid gap-4 p-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px , 1fr))" }}
      >
      </div> */}

      <div className="">
        {
          <section style={{ margin: "auto", maxWidth: "600px" }}>
            {LazyLoading ? (
              <div className="p-3 d-flex justify-content-center">
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

                {user_post.map((ps, idx) => {
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
    </div>
  );
};

export default UserProfile;
