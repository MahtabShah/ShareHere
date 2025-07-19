// import { StrictMode } from "react";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { QuoteProvider } from "./context/QueotrContext.jsx";
import All_Post_Section from "./All_Post_Section.jsx";
import PostSentence from "./maincomponents/PostSentance.jsx";
import MainHeader from "../src/maincomponents/MainHeader.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfile from "./maincomponents/UserProfile.jsx";
import { SearchBaar } from "../TinyComponent/SearchBaar";
import BottomNav from "../TinyComponent/BotoomNav.jsx";
import EditUserProfile from "./maincomponents/EditProfile.jsx";
import Signup from "./maincomponents/Signup";
import Login from "./maincomponents/Login";
import { StatusRing } from "./maincomponents/Status";
import ParentStatusComponent from "./maincomponents/Status";
import { useQuote } from "./context/QueotrContext";
import Explore from "./maincomponents/Explore.jsx";
import SuggetionSlip from "./maincomponents/NewUserUpdate.jsx";
import LeftNavbar from "./maincomponents/LeftNavbar.jsx";
import "./index.css";
import { ThemeProvider, useTheme } from "./context/Theme.jsx";
import { VibeEditorProvider } from "./context/VibeEditorContext.jsx";

const StatusPage = () => {
  const [followings, setFollowings] = useState();
  const { admin_user } = useQuote();

  useEffect(() => {
    if (admin_user?.following) {
      setFollowings(admin_user.following || []);
    }
  }, [admin_user?.following]);

  // console.log("followings", followings, admin_user);

  return (
    <>
      <div className="d-flex gap-3 mt-3 overflow-x-auto status-parent align-items-center w-100 px-2">
        {admin_user?._id && (
          <StatusRing user={admin_user} userIdx={"-idx-admin"} />
        )}

        {followings?.length > 0 && (
          <ParentStatusComponent followings={followings} />
        )}
      </div>
    </>
  );
};

const Main = () => {
  const [sm_break_point, setsm_break_point] = useState(window.innerWidth < 768);
  const [lgbreakPoint, setlgbreakPoint] = useState(window.innerWidth > 1224);
  const [mobile_break_point, setmobile_break_point] = useState(
    window.innerWidth < 540
  );

  const breakPoint = () => {
    setsm_break_point(window.innerWidth < 768);
    setlgbreakPoint(window.innerWidth > 1224);
    setmobile_break_point(window.innerWidth < 540);
  };

  useEffect(() => {
    window.addEventListener("resize", breakPoint);
    window.addEventListener("onload", breakPoint);
  }, []);

  return (
    <BrowserRouter>
      <QuoteProvider>
        <VibeEditorProvider>
          <ThemeProvider>
            <LeftNavbar />
            {mobile_break_point && <MainHeader />}

            <Routes>
              <Route
                path="/Explore"
                element={
                  <div
                    style={{
                      marginLeft: `${
                        mobile_break_point
                          ? "0px"
                          : sm_break_point
                          ? "54px"
                          : "228px"
                      }`,
                    }}
                  >
                    <Explore />
                  </div>
                }
              />
              <Route
                path="/signup"
                element={
                  <div
                    style={{
                      marginLeft: `${
                        mobile_break_point
                          ? "0px"
                          : sm_break_point
                          ? "54px"
                          : "228px"
                      }`,
                    }}
                  >
                    <Signup />
                  </div>
                }
              />
              <Route
                path="/login"
                element={
                  <div
                    style={{
                      marginLeft: `${
                        mobile_break_point
                          ? "0px"
                          : sm_break_point
                          ? "54px"
                          : "228px"
                      }`,
                    }}
                  >
                    <Login />
                  </div>
                }
              />
              <Route
                path="/*"
                element={
                  <main
                    className="p-0 mb-5 me-0"
                    style={{
                      marginLeft: `${
                        mobile_break_point
                          ? "0px"
                          : sm_break_point
                          ? "54px"
                          : "228px"
                      }`,
                    }}
                  >
                    <BottomNav />
                    {/* <div
                      style={{
                        margin: "auto",
                        marginTop: `${mobile_break_point ? "50px" : "0"}`,
                        maxWidth: "600px",
                      }}
                      className="w-100 p-2"
                    >
                      <SearchBaar />
                    </div> */}
                    {/* <StatusPage /> */}
                    <All_Post_Section />
                  </main>
                }
              />
              <Route
                path="/home/:postId?"
                element={
                  <main
                    className={`p-0 mb-5 ${mobile_break_point ? "" : "ps-2"}`}
                    style={{
                      marginLeft: `${
                        mobile_break_point
                          ? "0px"
                          : sm_break_point
                          ? "54px"
                          : "228px"
                      }`,
                    }}
                  >
                    <BottomNav />
                    {/* <div
                      style={{
                        margin: "auto",
                        marginTop: `${mobile_break_point ? "50px" : "0"}`,
                        maxWidth: "601px",
                      }}
                      className="w-100 p-2"
                    >
                      <SearchBaar />
                    </div> */}
                    {/* <StatusPage /> */}
                    <All_Post_Section />
                  </main>
                }
              />
              <Route
                path="/api/user/:id"
                element={
                  <main
                    className="p-0 mt-0"
                    style={{
                      marginLeft: `${
                        mobile_break_point
                          ? "0px"
                          : sm_break_point
                          ? "54px"
                          : "228px"
                      }`,
                    }}
                  >
                    <BottomNav />
                    <UserProfile />
                  </main>
                }
              />
              <Route
                path="/api/user/edit/:id"
                element={
                  <main
                    className="p-0 pt-2"
                    style={{
                      marginLeft: `${
                        mobile_break_point
                          ? "0px"
                          : sm_break_point
                          ? "54px"
                          : "228px"
                      }`,

                      marginTop: `${mobile_break_point ? "44px" : "0"}`,
                    }}
                  >
                    <BottomNav />
                    <EditUserProfile />
                  </main>
                }
              />
            </Routes>
          </ThemeProvider>
        </VibeEditorProvider>
      </QuoteProvider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(<Main />);
