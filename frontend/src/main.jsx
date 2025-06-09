// import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QuoteProvider } from "./context/QueotrContext.jsx";
import All_Post_Section from "./All_Post_Section.jsx";
import PostSentence from "./maincomponents/PostSentance.jsx";
import MainHeader from "../src/maincomponents/MainHeader.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfile from "./maincomponents/UserProfile.jsx";
import { SearchBaar } from "../TinyComponent/SearchBaar";
import BottomNav from "../TinyComponent/BotoomNav.jsx";
import EditUserProfile from "./maincomponents/EditProfile.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QuoteProvider>
      <main className="container p-0 pt-2 mt-5">
        <MainHeader />
        <PostSentence />

        <BottomNav />

        <Routes>
          <Route
            path="/*"
            element={
              <>
                <SearchBaar />
                <All_Post_Section />
              </>
            }
          />
          <Route
            path="/home/postId?"
            element={
              <>
                <SearchBaar />
                <All_Post_Section />
              </>
            }
          />
          <Route path="api/user/:id" element={<UserProfile />} />
          <Route path="api/user/edit/:id" element={<EditUserProfile />} />
        </Routes>
      </main>
    </QuoteProvider>
  </BrowserRouter>
);
