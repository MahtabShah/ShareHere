// import { StrictMode } from "react";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  useNavigate,
  useLocation,
  Routes,
  Route,
} from "react-router-dom";
import { QuoteProvider, useQuote } from "./context/QueotrContext.jsx";
import MainHeader from "../src/maincomponents/MainHeader.jsx";
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
import { StatusProvider } from "./context/StatusContext.jsx";
import { getActiveNavFromPath } from "./context/navUtils.js";
import EditPost from "./maincomponents/EditPost.jsx";
import CanvasVibeEditor from "./maincomponents/CanvasEditor.jsx";

import EditorZ from "./editor/components/editor.jsx";

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
    // element: <EditorZ />,
  },
];

const AppLayout = () => {
  const location = useLocation();
  const { mobile_break_point, isNavCollapsed, openSlidWin, setActiveIndex } =
    useQuote();

  useEffect(() => {
    if (!openSlidWin) {
      const currentNav = getActiveNavFromPath(location.pathname);
      setActiveIndex(currentNav);
    }
  }, [location.pathname, openSlidWin, setActiveIndex]);

  const mainStyle = {
    marginLeft: `${mobile_break_point ? "0px" : isNavCollapsed ? "74px" : "244px"}`,
    width: `${
      mobile_break_point
        ? "100%"
        : isNavCollapsed
          ? "calc(100% - 74px)"
          : "calc(100% - 244px)"
    }`,
    transition:
      "margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    minHeight: "100vh",
    paddingBottom: mobile_break_point ? "64px" : "0px",
  };

  return (
    <>
      <LeftNavbar />
      <MainHeader />
      <BottomNav />
      <div className="app-main-content" style={mainStyle}>
        <Routes>
          {RoutesArr.map((r, idx) => (
            <Route path={r.path} key={`routes-${idx}`} element={r.element} />
          ))}
        </Routes>
      </div>
    </>
  );
};

const Main = () => {
  return (
    <BrowserRouter>
      <QuoteProvider>
        <PostProvider>
          <VibeEditorProvider>
            <ThemeProvider>
              <StatusProvider>
                <AppLayout />
              </StatusProvider>
            </ThemeProvider>
          </VibeEditorProvider>
        </PostProvider>
      </QuoteProvider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(<Main />);
