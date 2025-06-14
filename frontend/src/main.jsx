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
        {admin_user && <StatusRing user={admin_user} userIdx={"-idx-admin"} />}

        {followings?.length > 0 && (
          <ParentStatusComponent followings={followings} />
        )}
      </div>
    </>
  );
};

const Main = () => {
  const { admin_user } = useQuote();

  return (
    <BrowserRouter>
      <QuoteProvider>
        <Routes>
          {!admin_user && (
            <>
              <Route path="/signup" element={<Signup />} />
              <Route path="/*" element={<Login />} />
            </>
          )}

          {admin_user && (
            <>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <main className="container p-0 pt-2 mt-5 mb-5">
                    <MainHeader />
                    <BottomNav />
                    <PostSentence />
                    <SearchBaar />
                    <StatusPage />
                    <All_Post_Section />
                  </main>
                }
              />
              <Route
                path="/home/:postId?"
                element={
                  <main className="container p-0 pt-2 mt-5 mb-5">
                    <MainHeader />
                    <BottomNav />
                    <PostSentence />
                    <SearchBaar />
                    <StatusPage />
                    <All_Post_Section />
                  </main>
                }
              />
              <Route
                path="/api/user/:id"
                element={
                  <main className="container p-0 pt-2 mt-5 mb-5">
                    <MainHeader />
                    <BottomNav />
                    <PostSentence />
                    <UserProfile />
                  </main>
                }
              />
              <Route
                path="/api/user/edit/:id"
                element={
                  <main className="container p-0 pt-2 mt-5 mb-5">
                    <MainHeader />
                    <BottomNav />
                    <PostSentence />
                    <EditUserProfile />
                  </main>
                }
              />
            </>
          )}
        </Routes>
      </QuoteProvider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(<Main />);
