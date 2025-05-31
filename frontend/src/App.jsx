import React, { Fragment } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import PostSentence from "./components/PostSentance";
import MySentences from "./components/MySentence";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { useEffect, useState } from "react";
import axios from "axios";
import socket from "./components/socket";
import "./App.css";
import { Loading } from "../TinyComponent/LazyLoading";
import MainHeader from "./components/MainHeader";
import LeftNavbar from "./components/LeftNavbar";
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
  //

  const [all_user, setall_user] = useState([]);
  const [all_comments, setall_comments] = useState([]);
  const [all_post_comments, setall_post_comments] = useState([]);

  const fetchAllUsers = async () => {
    try {
      await axios.get(`${API}/api/auth/home`).then((res) => {
        // console.log("response at Home.jsx ", res.data);
        setall_user(res.data);
      });
    } catch (error) {
      console.error("error : ", error);
    }

    try {
      await axios.get(`${API}/api/auth/all_sentence`).then((res) => {
        console.log("response at Home.jsx ", res.data);
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
    // console.log("see the token is defined : ", token);

    // const Interval = setInterval(() => {
    //   fetchSentences();
    //   fetchAllUsers();
    // }, 1000); // Fetch every 5 seconds
    // return () => clearInterval(Interval);
  }, [token]);

  useEffect(() => {
    socket.on("sentence", (sentence) => {
      fetchAllUsers();

      setSentences((prev) => [...prev, sentence]); // ✅ personal sentences
      // setall_comments((prev) => [sentence, ...prev]); // ✅ all user sentences
    });
    setLoading(false);

    return () => {
      socket.off("sentence");
    };
  }, []);

  return (
    <Router>
      <div className="p-0 pt-3">
        <MainHeader />
        <LeftNavbar isDisplayedLeftNav={isDisplayedLeftNav} />
        <section
          className="p-3"
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
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="api/sentence/my" element={<MySentences />} />
            <Route path="/upload" element={<UploadProduct />} />
            <Route
              path="/home"
              element={
                <>
                  <PostSentence
                    fetchSentences={fetchSentences}
                    fetchAllUsers={fetchAllUsers}
                  />

                  {/* <Home
                  all_user={all_user}
                  all_comments={all_comments}
                  fetchAllUsers={fetchAllUsers}
                  fetchSentences={fetchSentences}
                /> */}

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
                              ?.map((c, idx) => {
                                return (
                                  <Fragment key={idx}>
                                    {all_comments?.filter(
                                      (com) => com.userId === u._id
                                    ).length > 0 && (
                                      <>
                                        <Home
                                          user={u}
                                          comment={c}
                                          fetchAllUsers={fetchAllUsers}
                                          fetchSentences={fetchSentences}
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
                </>
              }
            />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
