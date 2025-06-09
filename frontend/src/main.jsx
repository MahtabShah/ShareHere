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

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QuoteProvider>
      <main className="container p-0">
        <MainHeader />
        <PostSentence />
        <SearchBaar />
        <BottomNav />

        <Routes>
          <Route path="/*" element={<All_Post_Section />} />
          <Route path="/home/postId?" element={<All_Post_Section />} />
          <Route path="api/user/:id" element={<UserProfile />} />
        </Routes>
      </main>
    </QuoteProvider>
  </BrowserRouter>
);
