import React, { Fragment } from "react";
import Signup from "./maincomponents/Signup";
import Login from "./maincomponents/Login";
import PostSentence from "./maincomponents/PostSentance";
import MySentences from "./maincomponents/MySentence";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import socket from "./maincomponents/socket";
import "./App.css";
import { Loading } from "../TinyComponent/LazyLoading";
import MainHeader from "./maincomponents/MainHeader";
import LeftNavbar from "./maincomponents/LeftNavbar";
import UserProfile from "./maincomponents/UserProfile";
import { Notification } from "../TinyComponent/Notification";
import BottomNav from "../TinyComponent/BotoomNav";
import { useLocation } from "react-router-dom";
import { useQuote } from "./context/QueotrContext";
import { StatusRing } from "./maincomponents/Status";
import { EachPost } from "./maincomponents/EachPost";
import ParentStatusComponent from "./maincomponents/Status";
import { SearchBaar } from "../TinyComponent/SearchBaar";
const API = import.meta.env.VITE_API_URL;

function App() {
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating

  const {
    fetch_all_users,
    all_user,
    setall_user,
    all_posts,
    isDisplayedLeftNav,
  } = useQuote();

  const [admin_user, setadmin_user] = useState(null);

  window.addEventListener("resize", () => {
    setIsDisplayedLeftNav(window.innerWidth < 768);
  });

  const fetch_all_posts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/sentence/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setLoading(false);
      res.data?.length === 0 ? "" : setSentences(res.data);
    } catch (err) {
      console.log("Failed to fetch your sentences see err", err);
    }
  };

  const fetch_admin_user = async () => {
    try {
      const res = await axios.get(`${API}/api/crud/crud`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setLoading(false);
      res.data?.length === 0 ? "" : setadmin_user(res.data);
    } catch (err) {
      console.log("Failed to fetch your sentences see err", err);
    }
  };
  //

  const [curr_all_notifications, setcurr_all_notifications] = useState([]);

  const fetch_all_notifications = async () => {
    try {
      const res = await axios.get(`${API}/api/crud/all_notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setLoading(false);
      // console.log("notiiiiiiii---->", res.data);
      setcurr_all_notifications(res.data);
    } catch (error) {
      console.log("erriorrr in notify", error);
    }
  };

  useEffect(() => {
    fetch_all_posts();
    fetch_admin_user();
    fetch_all_notifications();
    fetch_all_users();
  }, [token]);

  useEffect(() => {
    socket.on("sentence", (sentence) => {
      setSentences((prev) => [...prev, sentence]);
      fetch_all_posts();
      fetch_all_notifications();
      fetch_all_users();
      console.log("user related informations . . . . . . . 1", all_user);
    });

    socket.on("status", () => {
      fetchUserStatuses();
      fetch_all_users();
      console.log("user related informations . . . . . . . 2", all_user);
    });

    fetch_all_notifications();

    socket.on("userUpdated", (updatedUser) => {
      setall_user((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

      fetch_all_notifications();
      fetchUserStatuses();
      fetch_all_users();
      console.log("user related informations . . . . . . . 3", all_user);
    });
    setLoading(false);

    return () => {
      socket.off("sentence");
      socket.off("userUpdated");
      socket.off("status");
    };
  }, []);

  const admin = admin_user;

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const postId = params.get("postId"); // this should match c._id

  useEffect(() => {
    if (postId) {
      const target = document.getElementById(postId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [postId, all_posts]); // wait for all_posts to load

  const [statuses, setStatuses] = useState([]);
  const [followings, setFollowings] = useState([]);
  // console.log("admin 108 status", admin_user);

  const fetchUserStatuses = async () => {
    try {
      const res = await axios.get(`${API}/api/crud/all_status`, {
        headers: {
          Authorization: `Bearer ${token}`, // Optional, if protected
        },
      });
      setStatuses(res.data);
      // console.log("Status------------", res.data);
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
    }
  };
  useEffect(() => {
    if (admin_user?._id) {
      fetchUserStatuses();
    }
    const all_followings = admin_user?.following;
    setFollowings(all_followings);
  }, [admin_user]);

  return (
    <div className="p-0 pt-3 col-sm-10 col-md-12" style={{ margin: "auto" }}>
      <MainHeader
        fetchAllUsers={fetch_all_users}
        curr_all_notifications={curr_all_notifications}
        setcurr_all_notifications={setcurr_all_notifications}
      />
      <LeftNavbar isDisplayedLeftNav={isDisplayedLeftNav} />
      <BottomNav isDisplayedLeftNav={isDisplayedLeftNav} admin={admin} />
      <section
        className="p-0"
        style={{
          marginTop: "34px",
          marginBottom: "84px",
          marginLeft: `${!isDisplayedLeftNav ? "200px" : "0"}`,
        }}
      >
        <Routes>
          <>
            <Route
              path="/api/crud/all_notifications"
              element={<Notification />}
            />

            <Route
              path="/signup"
              element={<Signup fetchAllUsers={fetch_all_users} />}
            />
            <Route
              path="/login"
              element={<Login fetchAllUsers={fetch_all_users} />}
            />
            <Route
              path="api/sentence/my"
              element={<MySentences admin={admin} />}
            />
            <Route
              path="api/user/:id"
              element={
                <UserProfile
                  admin={admin}
                  all_user={all_user}
                  all_post={all_posts}
                />
              }
            />
            <Route
              path="/upload"
              element={
                <section
                  className={`${isDisplayedLeftNav ? "p-2" : "p-3"} pt-4`}
                  style={{ margin: "auto", maxWidth: "600px" }}
                >
                  <div className="d-flex justify-content-between">
                    <h4
                      className={`${isDisplayedLeftNav ? "ps-0" : "ps-0"}`}
                      // style={{ borderBottom: "1px solid #222" }}
                    >
                      Post a Vibe Ink Here
                    </h4>
                  </div>

                  <PostSentence
                    fetchSentences={fetch_all_posts}
                    fetchAllUsers={fetch_all_users}
                    all_user={all_user}
                    admin={admin}
                  />
                </section>
              }
            />
          </>
          <Route
            path="/home/postId?"
            element={
              <section
                className={`${isDisplayedLeftNav ? "p-0" : "p-3"} pt-4`}
                style={{ margin: "auto", maxWidth: "600px" }}
              >
                {/* <div className="d-flex gap-3 overflow-x-auto status-parent align-items-center w-100 px-2">
                  <StatusRing
                    userId={admin_user?._id}
                    all_statuses={statuses}
                  />
                  {followings?.length > 0 && (
                    <ParentStatusComponent
                      followings={followings}
                      statuses={statuses}
                    />
                  )}
                </div> */}

                {LazyLoading ? (
                  <div className="p-3 d-flex justify-content-center">
                    {" "}
                    <Loading dm={34} />
                  </div>
                ) : (
                  <>
                    {all_user?.length >= 1 &&
                      all_user?.map((u, idx) => {
                        return (
                          <Fragment key={`user${idx}`}>
                            {all_posts
                              ?.filter((com) => com.userId === u._id)
                              ?.map((c, indx) => {
                                return (
                                  <Fragment key={`comment${indx}`}>
                                    {all_posts?.filter(
                                      (com) => com.userId === u._id
                                    ).length > 0 && (
                                      <div id={c._id}>
                                        {" "}
                                        <EachPost
                                          user={u}
                                          comment={c}
                                          admin={admin}
                                          fetchAllUsers={fetch_all_users}
                                          fetchSentences={fetch_all_posts}
                                          isDisplayedLeftNav={
                                            isDisplayedLeftNav
                                          }
                                        />
                                      </div>
                                    )}
                                  </Fragment>
                                );
                              })}
                          </Fragment>
                        );
                      })}
                  </>
                )}
              </section>
            }
          />
        </Routes>
      </section>
    </div>
  );
}

export default App;
