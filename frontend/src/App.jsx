import React, { Fragment } from "react";
import Signup from "./maincomponents/Signup";
import Login from "./maincomponents/Login";
import PostSentence from "./maincomponents/PostSentance";
import MySentences from "./maincomponents/MySentence";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./maincomponents/Home";
import { useEffect, useState } from "react";
import axios from "axios";
import socket from "./maincomponents/socket";
import "./App.css";
import { Loading } from "../TinyComponent/LazyLoading";
import MainHeader from "./maincomponents/MainHeader";
import LeftNavbar from "./maincomponents/LeftNavbar";
import UploadProduct from "./pages/UploadProduct";
import { QuoteProvider } from "./context/QueotrContext";
import UserProfile from "./maincomponents/UserProfile";
import { Notification } from "../TinyComponent/Notification";
import BottomNav from "../TinyComponent/BotoomNav";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useQuote } from "./context/QueotrContext";
// import TextToImage from "../TinyComponent/ConvertDivintoImg";
import { StatusPage, StatusRing } from "./maincomponents/Status";
import { EachPost } from "./maincomponents/EachPost";
import ParentStatusComponent from "./maincomponents/Status";
import { StatusCarousel } from "./maincomponents/Status";
const API = import.meta.env.VITE_API_URL;

function App() {
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating
  const [isDisplayedLeftNav, setIsDisplayedLeftNav] = useState(
    window.innerWidth < 768
  );

  const { statusClicked } = useQuote();
  // console.log("statussssssssssssssssssssssss", statusClicked);
  const [lgbreakPoint, setlgbreakPoint] = useState(window.innerWidth > 1224);
  const [admin_user, setadmin_user] = useState(null);

  window.addEventListener("resize", () => {
    setIsDisplayedLeftNav(window.innerWidth < 768);
    setlgbreakPoint(window.innerWidth > 1224);
  });

  const fetchSentences = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/sentence/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setLoading(false);
      res.data?.length === 0 ? "" : setSentences(res.data);
      // // localStorage.setItem("token", res.data.token);
      // console.log(
      //   "Response from backend at line 21:",
      //   res.data,
      //   res.data.token
      // );
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

  const [all_user, setall_user] = useState([]);
  const [all_comments, setall_comments] = useState([]);
  const [all_post_comments, setall_post_comments] = useState([]);

  const fetchAllUsers = async () => {
    try {
      await axios.get(`${API}/api/auth/home`).then((res) => {
        // console.log("response at Home.jsx setall_user", res.data);
        setall_user(res.data);
      });
    } catch (error) {
      console.error("error : ", error);
    }

    try {
      await axios.get(`${API}/api/auth/all_sentence`).then((res) => {
        // console.log("response at Home.jsx all_sentence", res.data);
        setall_comments(res.data);
      });
    } catch (error) {
      console.error("error : ", error);
    }

    try {
      await axios.get(`${API}/api/auth/all_post_comments`).then((res) => {
        // console.log("response at Home.jsx ", res.data);
        setall_post_comments(res.data);
        setall_comments(res.data);
      });
    } catch (error) {
      console.error("error : ", error);
    }
  };

  useEffect(() => {
    fetchSentences();
    fetchAllUsers();
    fetch_admin_user();
    fetch_all_notifications();
  }, [token]);

  useEffect(() => {
    socket.on("sentence", (sentence) => {
      fetchAllUsers();

      setSentences((prev) => [...prev, sentence]);
      fetchSentences();
      fetchAllUsers();
      fetch_all_notifications();
    });

    socket.on("status", () => {
      fetchUserStatuses();
    });

    fetch_all_notifications();

    socket.on("userUpdated", (updatedUser) => {
      setall_user((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

      fetch_all_notifications();
    });

    setLoading(false);

    return () => {
      socket.off("sentence");
      socket.off("userUpdated");
      socket.off("status");
    };
  }, []);

  const admin = admin_user;

  // console.log("alll_coment===> ", all_comments);

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
  }, [postId, all_comments]); // wait for all_comments to load

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
  }, [admin_user]);

  // console.log("all_user?.followers", all_followings);
  const all_followings = admin_user?.following;

  useEffect(() => {
    setFollowings(all_followings);
  }, [all_followings]);

  return (
    <div className="p-0 pt-3 col-sm-10 col-md-12" style={{ margin: "auto" }}>
      <MainHeader
        fetchAllUsers={fetchAllUsers}
        admin={admin}
        curr_all_notifications={curr_all_notifications}
        setcurr_all_notifications={setcurr_all_notifications}
        // Track_post={Track_post}
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
          <Route
            path="/"
            element={
              <div>
                <hr />
                <PostSentence fetchSentences={fetchSentences} />
                <hr />
                <MySentences sentences={sentences} loading={loading} />
              </div>
            }
          />

          <Route
            path="/api/crud/all_notifications"
            element={<Notification />}
          />

          <Route
            path="/signup"
            element={<Signup fetchAllUsers={fetchAllUsers} />}
          />
          <Route
            path="/login"
            element={<Login fetchAllUsers={fetchAllUsers} />}
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
                all_post={all_comments}
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
                  {/* <h4 className="btn btn-outline-primary disable">
                    {" "}
                    add status +{" "}
                  </h4> */}
                </div>

                <PostSentence
                  fetchSentences={fetchSentences}
                  fetchAllUsers={fetchAllUsers}
                  all_user={all_user}
                  admin={admin}
                />
              </section>
            }
          />
          <Route
            path="/home/postId?"
            element={
              <section
                className={`${isDisplayedLeftNav ? "p-0" : "p-3"} pt-4`}
                style={{ margin: "auto", maxWidth: "600px" }}
              >
                {/* <StatusCarousel /> */}

                {followings && statuses && (
                  <div className="d-flex gap-3 overflow-x-auto status-parent align-items-center w-100 px-2">
                    <StatusRing
                      userId={admin_user?._id}
                      all_statuses={statuses}
                    />
                    <ParentStatusComponent
                      followings={followings}
                      statuses={statuses}
                    />
                  </div>
                )}

                {/* {selectedUserId && (
                  <div
                    className="border d-flex overflow-hidden p-2 pt-0 justify-content-center align-items-center position-fixed bg-dark"
                    style={{
                      height: "",
                      zIndex: "100000000",
                      top: "0",
                      left: "0",
                      right: "0",
                      bottom: "0",
                      opacity: "0.98",
                    }}
                  >
                    <StatusPage
                      userId={selectedUserId}
                      all_statuses={statuses}
                      onClose={() => setSelectedUserId(null)}
                    />
                  </div>
                )} */}

                {LazyLoading ? (
                  <div className="p-3 d-flex justify-content-center">
                    {" "}
                    <Loading dm={34} />
                  </div>
                ) : (
                  <>
                    {all_user?.map((u, idx) => {
                      return (
                        <Fragment key={idx}>
                          {all_comments
                            ?.filter((com) => com.userId === u._id)
                            ?.map((c, indx) => {
                              return (
                                <Fragment key={indx}>
                                  {all_comments?.filter(
                                    (com) => com.userId === u._id
                                  ).length > 0 && (
                                    <div id={c._id}>
                                      {" "}
                                      <EachPost
                                        user={u}
                                        comment={c}
                                        admin={admin}
                                        fetchAllUsers={fetchAllUsers}
                                        fetchSentences={fetchSentences}
                                        isDisplayedLeftNav={isDisplayedLeftNav}
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
