// import { StrictMode } from "react";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { QuoteProvider } from "./context/QueotrContext.jsx";
import MainHeader from "../src/maincomponents/MainHeader.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfile from "./maincomponents/UserProfile.jsx";
import BottomNav from "../TinyComponent/BotoomNav.jsx";
import EditUserProfile from "./maincomponents/EditProfile.jsx";
import Signup from "./maincomponents/Signup";
import Login from "./maincomponents/Login";
import Explore from "./maincomponents/Explore.jsx";
import LeftNavbar from "./maincomponents/LeftNavbar.jsx";
import "./index.css";
import { ThemeProvider, useTheme } from "./context/Theme.jsx";
import { VibeEditorProvider } from "./context/VibeEditorContext.jsx";
import { TrackPost } from "../TinyComponent/TrackPost.jsx";
import { PostProvider } from "./context/PostContext.jsx";
import { VibeTabs } from "./maincomponents/VibeTabs.jsx";
import EditPost from "./maincomponents/EditPost.jsx";
import { StatusProvider } from "./context/StatusContext.jsx";
import CanvasVibeEditor from "./maincomponents/CanvasEditor.jsx";

const RoutesArr = [
  {
    path: "/Explore",
    element: (
      <>
        <Explore />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Signup />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
      </>
    ),
  },
  {
    path: "/*",
    element: (
      <>
        <VibeTabs />
      </>
    ),
  },
  {
    path: "/post/edit/:id",
    element: (
      <>
        <EditPost />
        <BottomNav />
      </>
    ),
  },
  {
    path: "/home",
    element: (
      <>
        <VibeTabs />
      </>
    ),
  },
  {
    path: "/home/:postId",
    element: (
      <>
        <TrackPost />
      </>
    ),
  },
  {
    path: "/api/user/:id",
    element: (
      <>
        <UserProfile />
      </>
    ),
  },
  {
    path: "/api/user/edit/:id",
    element: (
      <>
        <EditUserProfile />
      </>
    ),
  },
  {
    path: "/Editor",
    element: <CanvasVibeEditor />,
  },
];

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

  const mainStyle = {
    marginLeft: `${mb ? "0px" : sm ? "74px" : "244px"}`,
    // overflow: "auto",
  };

  return (
    <BrowserRouter>
      <QuoteProvider>
        <PostProvider>
          <VibeEditorProvider>
            <ThemeProvider>
              <StatusProvider>
                <LeftNavbar />
                <MainHeader />
                <BottomNav />

                <Routes>
                  {RoutesArr.map((r, idx) => {
                    return (
                      <Route
                        path={r.path}
                        key={`routes-${idx}`}
                        element={
                          <div style={{ ...mainStyle }}>{r.element}</div>
                        }
                      />
                    );
                  })}
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
