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
import { TrackPost } from "../TinyComponent/TrackPost.jsx";
import { PostProvider } from "./context/PostContext.jsx";
import { VibeTabs } from "./maincomponents/VibeTabs.jsx";
import EditPost from "./maincomponents/EditPost.jsx";
import { StatusProvider } from "./context/StatusContext.jsx";

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
  const [sm, setsm] = useState(window.innerWidth < 1081);
  const [mb, setmb] = useState(window.innerWidth < 600);

  const breakPoint = () => {
    setsm(window.innerWidth < 1081);
    setmb(window.innerWidth < 600);
  };

  useEffect(() => {
    window.addEventListener("resize", breakPoint);
    window.addEventListener("onload", breakPoint);
  }, []);

  const mainStyle = { marginLeft: `${mb ? "0px" : sm ? "74px" : "244px"}` };

  return (
    <BrowserRouter>
      <QuoteProvider>
        <PostProvider>
          <VibeEditorProvider>
            <ThemeProvider>
              <StatusProvider>
                <LeftNavbar />
                <MainHeader />

                <Routes>
                  <Route
                    path="/Explore"
                    element={
                      <div style={{ ...mainStyle }}>
                        <Explore />
                      </div>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <div style={{ ...mainStyle }}>
                        <Signup />
                      </div>
                    }
                  />

                  <Route
                    path="/login"
                    element={
                      <div style={{ ...mainStyle }}>
                        <Login />
                      </div>
                    }
                  />
                  <Route
                    path="/*"
                    element={
                      <main style={{ ...mainStyle }}>
                        <BottomNav />
                        <VibeTabs />
                      </main>
                    }
                  />

                  <Route
                    path="/post/edit/:id"
                    element={
                      <div style={{ ...mainStyle }}>
                        <EditPost />
                        <BottomNav />
                      </div>
                    }
                  />

                  <Route
                    path="/home"
                    element={
                      <main style={{ ...mainStyle }}>
                        <BottomNav />
                        <VibeTabs />
                      </main>
                    }
                  />

                  <Route
                    path="/home/:postId"
                    element={
                      <main style={{ ...mainStyle }}>
                        <BottomNav />
                        <TrackPost />
                      </main>
                    }
                  />
                  <Route
                    path="/api/user/:id"
                    element={
                      <main style={{ ...mainStyle }}>
                        <BottomNav />
                        <UserProfile />
                      </main>
                    }
                  />
                  <Route
                    path="/api/user/edit/:id"
                    element={
                      <main style={{ ...mainStyle }}>
                        <BottomNav />
                        <EditUserProfile />
                      </main>
                    }
                  />
                </Routes>
              </StatusProvider>
            </ThemeProvider>
          </VibeEditorProvider>
        </PostProvider>
      </QuoteProvider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(<Main />);
