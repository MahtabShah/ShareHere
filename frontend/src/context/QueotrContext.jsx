// Quote Context.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const QuoteContext = createContext();
const API = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

import socket from "../maincomponents/socket";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const useQuote = () => useContext(QuoteContext) || {};

export const QuoteProvider = ({ children }) => {
  const [sm_break_point, setsm_break_point] = useState(window.innerWidth < 768);

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
  const [all_statuses, setall_statuses] = useState([]);
  const [all_posts, set_all_posts] = useState([]);
  const [sorted_posts, set_sorted_posts] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [uploadClicked, setUploadClicked] = useState(false);
  const [all_post_loading, setAll_post_loading] = useState(false);
  const [Errors, setErrors] = useState(null);
  const [hasSorted, setHasSorted] = useState(false);
  const [curr_all_notifications, setcurr_all_notifications] = useState([]);
  const [all_user, setall_user] = useState([]);

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
      // navigate("/login") || navigate("/signup");
      // setadmin_user(null);
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
      setall_statuses(res.data);
      // console.log("Status------------", res.data);
    } catch (error) {
      console.error("Failed to fetch all_statuses:", error);
    }
  };

  const fetch_all_users = async () => {
    try {
      setAll_post_loading(true);

      await axios.get(`${API}/api/auth/home`).then((res) => {
        // console.log("response at Home.jsx setall_user", res.data);
        setall_user(res.data);
      });

      setAll_post_loading(false);
    } catch (error) {
      console.error("error : ", error);
      setErrors(error);
    }
  };

  const fetch_all_posts = async () => {
    setLoading(true);
    setAll_post_loading(true);

    try {
      const res = await axios.get(`${API}/api/auth/all_sentence`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setLoading(false);
      res.data?.length === 0 ? "" : set_all_posts(res.data);
    } catch (err) {
      console.log("Failed to fetch your sentences see err", err);
      setErrors(err);
    }

    setAll_post_loading(false);
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
      // fetch_user_statuses();
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
    backgroundPosition: "center center",
    backgroundSize: "cover",
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
        const index = prevPosts.findIndex((p) => p?._id === sentence?._id);

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
          user?._id === updatedUser?._id ? updatedUser : user
        )
      );
    };

    socket.on("userUpdated", handleUserUpdate);
    socket.on("update", fetch_all_posts);
    socket.on("status", () => {
      fetch_user_statuses();
      fetch_admin_user();
    });
    socket.on("Notification", fetch_all_notifications);

    return () => {
      socket.off("userUpdated", handleUserUpdate);
      socket.off("Notification", fetch_all_notifications);
      socket.off("update", fetch_all_posts);
      socket.off("status", fetch_user_statuses);
    };
  }, []);

  useEffect(() => {
    if (!hasSorted && all_posts?.length > 0) {
      const sorted = all_posts
        .map((post) => ({
          ...post,
          rank: Rank_Calculation(post),
        }))
        .sort((a, b) => b.rank - a.rank);

      set_all_posts(sorted);
      setHasSorted(true);
      // console.log("Deep cloned & sorted posts:", sorted);
    }
  }, [all_posts, hasSorted]);

  useEffect(async () => {
    setInterval(async () => {
      try {
        const res = await axios.delete(`${API}/api/crud/del_status`);
        // console.log("setcurr_all_notifications---->", res.data);
      } catch (error) {
        console.log("error in notify", error);
      }
    }, 10000);
    // Cleanup function: will run when the component unmounts or dependencies change
    // return () => clearInterval(del_status);
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
        setall_statuses,
        HandleShare,
        setStatusClicked,
        curr_all_notifications,
        fetch_all_notifications,
        fetch_user_byId,
        setLoading,
        setUploadClicked,
        uploadClicked,
        setUploadClicked,
        API,
        selectedUserId,
        admin_user,
        isPaused,
        all_followings,
        all_statuses,
        token,
        all_user,
        all_posts,
        followersMap,
        all_post_loading,
        Errors,
        updateFollowersMap,
        toggleFollowStatus,
        token,
        sorted_posts,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

function Rank_Calculation(post) {
  if (!post) return 0;

  const now = dayjs();
  const createdAt = dayjs(post?.createdAt);
  const ageInHours = now.diff(createdAt, "minute") || 1; // prevent divide by 0

  const likes = post?.likes?.length || 0;
  const comments = post?.comments?.length || 0;
  const followers = post?.followers?.length || 1;
  const following = post?.following?.length || 1;
  // const isFollowed = post?.followers?.includes(u=>u._id == admin_user?._id) || 1;

  // Engagement Score
  const engagement = likes * 3 + comments * 7; // comment > like

  // Network influence
  const influence = Math.log10(followers + 1) / Math.log10(following + 2); // avoid division explosion

  // Recency Bonus: newer posts get higher weight
  const recencyFactor = 3600 / ageInHours; // decay over 1 day

  // Final rank formula (tunable)
  const rank = engagement * recencyFactor * influence;

  return Math.round(rank * (Math.random() * 100 + 1) * 100) / 100; // round to 2 decimal places
}
