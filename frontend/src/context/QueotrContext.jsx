// Quote Context.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const QuoteContext = createContext();
const API = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";
import socket from "../maincomponents/socket";

export const useQuote = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
  const [sm_break_point, setsm_break_point] = useState(window.innerWidth < 768);

  const nevigate = useNavigate();

  window.addEventListener("resize", () => {
    setsm_break_point(window.innerWidth < 768);
    // setlgbreakPoint(window.innerWidth > 1224);
  });

  const [statusClicked, setStatusClicked] = useState(false);
  const [duration, setDuration] = useState(3000);
  const [isPaused, setIsPaused] = useState(false);
  const [admin_user, setadmin_user] = useState(null);
  const [user, set_user] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [all_posts, set_all_posts] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [uploadClicked, setUploadClicked] = useState(false);

  const [curr_all_notifications, setcurr_all_notifications] = useState([]);

  const token = localStorage.getItem("token");

  const fetch_admin_user = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`${API}/api/crud/crud`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setLoading(false);
      res.data?.length === 0 ? "" : setadmin_user(res.data);
    } catch (err) {
      // nevigate("/signup");
      console.log("Failed to fetch admin see err in console 34 context", err);
    }
  };

  const fetch_user_byId = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`${API}/api/crud/get_userbyId/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setLoading(false);
      if (res.data?.length !== 0) {
        return res.data;
      }
    } catch (err) {
      // nevigate("/signup");
      console.log("Failed to fetch admin see err in console 34 context", err);
    }
  };

  const fetch_user_statuses = async () => {
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

  const [all_user, setall_user] = useState([]);

  const fetch_all_users = async () => {
    try {
      await axios.get(`${API}/api/auth/home`).then((res) => {
        // console.log("response at Home.jsx setall_user", res.data);
        setall_user(res.data);
      });
    } catch (error) {
      console.error("error : ", error);
    }
  };

  const fetch_all_posts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/auth/all_sentence`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setLoading(false);
      res.data?.length === 0 ? "" : set_all_posts(res.data);
    } catch (err) {
      console.log("Failed to fetch your sentences see err", err);
    }
  };

  const fetch_all_notifications = async () => {
    try {
      const res = await axios.get(`${API}/api/crud/all_notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setLoading(false);
      console.log("setcurr_all_notifications---->", res.data);
      setcurr_all_notifications(res.data);
    } catch (error) {
      console.log("erriorrr in notify", error);
    }
  };

  const HandleShare = async () => {
    const url = new URL(window.location.href);
    const scrollY = window.scrollY || window.pageYOffset;
    url.searchParams.set("scroll", scrollY);

    const shareData = {
      title: document.title,
      text: "Check out this page!",
      url: url.toString(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        alert("Share cancelled or failed.");
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(url.toString());
        alert("URL copied to clipboard (native share not supported).");
      } catch {
        alert("Failed to copy URL.");
      }
    }
  };

  const all_followings = admin_user?.following;

  useEffect(() => {
    fetch_admin_user();
    fetch_all_users();
    fetch_all_posts();

    if (admin_user?._id) {
      fetch_user_statuses();
    }
  }, []);

  const [style, setStyle] = useState({
    fontFamily: "Arial",
    fontSize: "24px",
    fontWeight: "400",
    color: "#000000",
    backgroundColor: "#ffffff",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "center",
    letterSpacing: "0px",
    boxShadow: "none",
  });

  const [followersMap, setFollowersMap] = useState({}); // { userId: true/false }
  const updateFollowersMap = (userId, isNowFollowing) => {
    setFollowersMap((prev) => ({
      ...prev,
      [userId]: isNowFollowing,
    }));
  };

  const toggleFollowStatus = async (userId) => {
    try {
      // Flip follow status locally first
      const isNowFollowing = !followersMap[userId];
      updateFollowersMap(userId, isNowFollowing);

      // API call
      await axios.put(
        `${API}/api/crud/crud_follow_post`,
        { id: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error updating follow status:", err);
      // Revert back on error
      updateFollowersMap(userId, followersMap[userId]);
    }
  };

  useEffect(() => {
    const handleNewOrUpdatedSentence = (sentence) => {
      set_all_posts((prevPosts) => {
        const index = prevPosts.findIndex((p) => p._id === sentence?._id);

        if (index !== -1) {
          const updatedPosts = [...prevPosts];
          updatedPosts[index] = {
            ...updatedPosts[index], // keep old data like `user`
            ...sentence, // overwrite updated fields
          };
          return updatedPosts;
        } else {
          return [...prevPosts, sentence];
        }
      });
    };

    socket.on("sentence", handleNewOrUpdatedSentence);

    return () => {
      socket.off("sentence", handleNewOrUpdatedSentence);
    };
  }, []);

  useEffect(() => {
    const handleUserUpdate = (updatedUser) => {
      setall_user((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    };

    socket.on("userUpdated", handleUserUpdate);
    socket.on("Notification", fetch_all_notifications);

    return () => {
      socket.off("userUpdated", handleUserUpdate);
      socket.off("Notification", fetch_all_notifications);
    };
  }, []);

  return (
    <QuoteContext.Provider
      value={{
        style,
        setStyle,
        sm_break_point,
        statusClicked,
        duration,
        setDuration,
        setIsPaused,
        fetch_admin_user,
        setSelectedUserId,
        fetch_user_statuses,
        fetch_all_notifications,
        fetch_all_posts,
        fetch_all_users,
        setStatuses,
        HandleShare,
        setStatusClicked,
        curr_all_notifications,
        fetch_all_notifications,
        fetch_user_byId,
        setLoading,
        setUploadClicked,
        uploadClicked,
        setUploadClicked,

        selectedUserId,
        admin_user,
        isPaused,
        all_followings,
        statuses,
        token,
        all_user,
        all_posts,
        followersMap,
        updateFollowersMap,
        toggleFollowStatus,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
