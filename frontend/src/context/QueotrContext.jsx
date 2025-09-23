// Quote Context.js
import { createContext, useContext, useState, useEffect } from "react";
import axios, { all } from "axios";
const QuoteContext = createContext();
const API = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

import socket from "../maincomponents/socket";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const useQuote = () => useContext(QuoteContext) || {};

export const QuoteProvider = ({ children }) => {
  const [sm_break_point, setsm_break_point] = useState(
    window.innerWidth < 1181
  );
  const [lgbreakPoint, setlgbreakPoint] = useState(window.innerWidth > 1300);
  const [mobile_break_point, setmobile_break_point] = useState(
    window.innerWidth <= 600
  );

  const [activeIndex, setActiveIndex] = useState("home");
  const [openSlidWin, setopenSlidWin] = useState(false);

  window.addEventListener("resize", () => {
    setsm_break_point(window.innerWidth < 1181);
    setlgbreakPoint(window.innerWidth > 1300);
    setmobile_break_point(window.innerWidth < 600);
  });

  const [statusClicked, setStatusClicked] = useState(false);
  const [duration, setDuration] = useState(3000);
  const [isPaused, setIsPaused] = useState(false);
  const [admin_user, setadmin_user] = useState(null);
  // const [user, set_user] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [all_statuses, setall_statuses] = useState([]);
  const [all_posts, set_all_posts] = useState([]);
  const [sorted_posts, set_sorted_posts] = useState([]);
  // const [followings, setFollowings] = useState([]);
  const [uploadClicked, setUploadClicked] = useState(false);
  const [all_post_loading, setAll_post_loading] = useState(false);
  const [Errors, setErrors] = useState(null);
  const [curr_all_notifications, setcurr_all_notifications] = useState([]);
  const [all_user, setall_user] = useState([]);
  const [VisibleNotification, setVisibleNotification] = useState(false);
  const limit = 2; // how many items per page
  let page = 1;
  const token = localStorage.getItem("token");
  const [count, setCount] = useState(null);

  const fetch_admin_user = async () => {
    try {
      if (token) {
        const res = await axios.get(`${API}/api/crud/crud`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        res.data?.length === 0 ? "" : setadmin_user(res.data);

        console.log("admin st", res?.data?.status?.[0]);
      }
    } catch (err) {
      console.log("Failed to fetch admin see err in console 34 context", err);
    }
  };

  const fetch_user_statuses = async () => {
    try {
      if (token) {
        const res = await axios.get(`${API}/api/crud/all_status`, {
          headers: {
            Authorization: `Bearer ${token}`, // Optional, if protected
          },
        });
        setall_statuses(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch all_statuses:", error);
    }
  };

  const fetch_all_users = async () => {
    try {
      setAll_post_loading(true);

      await axios.get(`${API}/api/auth/home`).then((res) => {
        setall_user(res.data);
      });
    } catch (error) {
      console.error("error : ", error);
      setErrors(error);
    }

    setAll_post_loading(false);
  };

  const fetch_all_notifications = async () => {
    try {
      if (token) {
        const res = await axios.get(`${API}/api/crud/all_notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log("setcurr_all_notifications---->", res.data);
        setcurr_all_notifications(res.data);
        return res.data;
      }
    } catch (error) {
      console.log("erriorrr in notify", error);
    }
  };

  const HandleShare = async (id) => {
    // const url = new URL(window.location.href);
    // const scrollY = window.scrollY || window.pageYOffset;
    // url.searchParams.set("scroll", scrollY);

    const shareData = {
      title: document.title,
      text: "Check out this page!",
      url: `/home/${id}`,
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
    if (token) {
      fetch_admin_user();
      fetch_all_notifications();
    }
    fetch_all_users();
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
    const handleUserUpdate = (updatedUser) => {
      console.log("updatedUser", updatedUser);
      setall_user((prevUsers) =>
        prevUsers.map((user) =>
          user?._id === updatedUser?._id ? updatedUser : user
        )
      );
    };

    socket.on("userUpdated", handleUserUpdate);

    socket.on("Notification", fetch_all_notifications);

    return () => {
      socket.off("userUpdated", handleUserUpdate);
      socket.off("Notification", fetch_all_notifications);
      socket.off("update", fetch_user_statuses);
    };
  }, []);

  useEffect(() => {
    // setInterval(async () => {
    //   try {
    //     const res = await axios.delete(`${API}/api/crud/del_status`);
    //   } catch (error) {
    //     console.log("error in notify", error);
    //   }
    // }, 10000);
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
        setadmin_user,
        setIsPaused,
        fetch_admin_user,
        setSelectedUserId,
        fetch_user_statuses,
        fetch_all_notifications,
        fetch_all_users,
        setall_statuses,
        HandleShare,
        setStatusClicked,
        curr_all_notifications,
        fetch_all_notifications,
        setCount,
        count,

        setLoading,
        openSlidWin,
        setopenSlidWin,
        activeIndex,
        limit,
        page,
        set_all_posts,
        setActiveIndex,
        setUploadClicked,
        uploadClicked,
        setUploadClicked,
        API,
        mobile_break_point,
        lgbreakPoint,
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
        setVisibleNotification,
        setAll_post_loading,
        VisibleNotification,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
