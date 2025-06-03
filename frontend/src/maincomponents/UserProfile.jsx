import React, { useState, useEffect, use } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Home } from "./Home";
const API = import.meta.env.VITE_API_URL;
import { Loading } from "../../TinyComponent/LazyLoading";
import { useQuote } from "../context/QueotrContext";
import { Fragment } from "react";

const UserProfile = ({
  all_user,
  admin,
  all_post,
  fetchAllUsers,
  fetchSentences,
}) => {
  // const [OnEditMode, setOnEditMode] = useState(false);
  // const nevigate = useNavigate();
  const { id } = useParams();
  const { isDisplayedLeftNav } = useQuote();
  // setUser(User);
  // setUser(User);
  const user = all_user?.find((u) => u._id === id);
  // fetchUser();
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating

  const token = localStorage.getItem("token");

  // console.log("UserProfile component User:", user, id, admin);

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

  const user_post = all_post.filter((el) => el.userId === id);
  console.log("user post ", all_post, user_post);

  return (
    <div
      className="d-flex flex-column bg-light text-dark border"
      style={{ maxWidth: "600px", margin: "auto", marginTop: "34px" }}
    >
      <div
        className="photoHeader w-100 position-relative border"
        style={{ height: "calc(120px + 20dvw)", maxHeight: "300px" }}
      >
        <div
          className="text-center position-absolute ps-3"
          style={{ bottom: "calc(-50px)" }}
        >
          <img
            src={user?.profile_pic}
            className="rounded-circle"
            alt="Profile"
            width="100"
            height="100"
            style={{ background: user?.bg_clr }}
          />
        </div>
        <img
          src={user?.cover_pic}
          alt="cover"
          className="w-100 h-100"
          style={{
            objectFit: "cover",
            // maxHeight: "400px",
          }}
        />
      </div>

      <div className="text-end pe-3 pt-3" style={{ height: "60px" }}>
        {id !== admin?._id && (
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => {
              HandleFollow();
            }}
          >
            {isfollowed ? "Follow" : "Unfollow"}
          </button>
        )}

        <button
          className="btn btn-outline-dark btn-sm ms-2"
          // onClick={onEditMode}
        >
          Edit Profile
        </button>
      </div>

      <div className="ps-3 d-flex justify-content-between">
        <div>
          <h4 className="mt-3">{user?.username}</h4>
          {/* <p className="mb-1">{User?.channel_name}</p> */}
          <p className="small">{user?.bio}</p>
          {/* <p className="small">{User?.about_user}</p> */}
        </div>
        <div className="d-flex gap-3 ps-3 pe-3 mt-3">
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

      <hr className="bg-light" />
      <h4 className="ps-3">Vibes share by @{user?.username}</h4>

      {/* <div
        className="d-grid gap-4 p-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px , 1fr))" }}
      >
      </div> */}

      <div className="border">
        {
          <section style={{ margin: "auto", maxWidth: "600px" }}>
            {LazyLoading ? (
              <div className="p-3 d-flex justify-content-center">
                {" "}
                <Loading dm={34} />
              </div>
            ) : (
              <>
                {/* {all_user?.map((u, idx) => {
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
                        <Home
                          user={user}
                          comment={ps}
                          admin={admin}
                          isDisplayedLeftNav={isDisplayedLeftNav}
                          fetchAllUsers={fetchAllUsers}
                          fetchSentences={fetchSentences}
                        />
                      </Fragment>
                    </>
                  );
                })}
              </>
            )}
          </section>
        }
      </div>

      {/* <div className="p-3">
        {User?.posts?.map((post, i) => (
          <ProductOrderPage
            setUser={setUser}
            key={`products${i}`}
            post={post}
            User={User}
            fetchUser={fetchUser}
          />
        ))}
      </div> */}
    </div>
  );
};

export default UserProfile;
