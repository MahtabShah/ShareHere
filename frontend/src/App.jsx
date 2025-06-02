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
const API = import.meta.env.VITE_API_URL;

function App() {
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating
  const [isDisplayedLeftNav, setIsDisplayedLeftNav] = useState(
    window.innerWidth < 768
  );

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
        console.log("response at Home.jsx all_sentence", res.data);
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
  }, [token]);

  useEffect(() => {
    socket.on("sentence", (sentence) => {
      fetchAllUsers();

      setSentences((prev) => [...prev, sentence]);
      fetchSentences();
      fetchAllUsers();
    });

    socket.on("userUpdated", (updatedUser) => {
      setall_user((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    });

    setLoading(false);

    return () => {
      socket.off("sentence");
      socket.off("userUpdated");
    };
  }, []);

  const admin = admin_user;

  // console.log("alll_coment===> ", all_comments);

  return (
    <Router>
      <div className="p-0 pt-4 col-sm-10 col-md-12" style={{ margin: "auto" }}>
        <MainHeader fetchAllUsers={fetchAllUsers} />
        <LeftNavbar isDisplayedLeftNav={isDisplayedLeftNav} />
        <section
          className="p-0"
          style={{
            marginTop: "34px",
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
              path="/signup"
              element={<Signup fetchAllUsers={fetchAllUsers} />}
            />
            <Route
              path="/login"
              element={<Login fetchAllUsers={fetchAllUsers} />}
            />
            <Route path="api/sentence/my" element={<MySentences />} />
            <Route path="/upload" element={<UploadProduct />} />
            <Route
              path="/home"
              element={
                <section
                  className={`${isDisplayedLeftNav ? "p-2" : "p-3"} pt-4`}
                  style={{ margin: "auto", maxWidth: "600px" }}
                >
                  <h4
                    className={`${isDisplayedLeftNav ? "ps-0" : "ps-3"}`}
                    // style={{ borderBottom: "1px solid #222" }}
                  >
                    Post a Vibe Ink Here
                  </h4>

                  <PostSentence
                    fetchSentences={fetchSentences}
                    fetchAllUsers={fetchAllUsers}
                    all_user={all_user}
                    admin={admin}
                  />

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
                            {" "}
                            {all_comments
                              ?.filter((com) => com.userId === u._id)
                              ?.map((c, indx) => {
                                return (
                                  <Fragment key={indx}>
                                    {all_comments?.filter(
                                      (com) => com.userId === u._id
                                    ).length > 0 && (
                                      <>
                                        <Home
                                          user={u}
                                          comment={c}
                                          admin={admin}
                                          fetchAllUsers={fetchAllUsers}
                                          fetchSentences={fetchSentences}
                                          isDisplayedLeftNav={
                                            isDisplayedLeftNav
                                          }
                                        />
                                      </>
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
    </Router>
  );
}

export default App;
