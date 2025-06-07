// Quote Context.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const QuoteContext = createContext();
const API = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

export const useQuote = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
  const [isDisplayedLeftNav, setIsDisplayedLeftNav] = useState(
    window.innerWidth < 768
  );

  const nevigate = useNavigate();

  window.addEventListener("resize", () => {
    setIsDisplayedLeftNav(window.innerWidth < 768);
    // setlgbreakPoint(window.innerWidth > 1224);
  });

  const [statusClicked, setStatusClicked] = useState(false);
  const [duration, setDuration] = useState(3000);
  const [isPaused, setIsPaused] = useState(false);
  const [admin_user, setadmin_user] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [statuses, setStatuses] = useState([]);
  const [followings, setFollowings] = useState([]);
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
      nevigate("/signup");
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
  const all_followings = admin_user?.following;

  useEffect(() => {
    if (admin_user?._id) {
      fetch_user_statuses();
    }
  }, []);

  useEffect(() => {
    fetch_user_statuses();
    setFollowings(all_followings);
    // alert("alert");
  }, []);

  useEffect(() => {
    fetch_admin_user();
  }, []);
  //

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

  return (
    <QuoteContext.Provider
      value={{
        style,
        setStyle,
        isDisplayedLeftNav,
        setStatusClicked,
        statusClicked,
        duration,
        setDuration,
        isPaused,
        setIsPaused,
        admin_user,
        fetch_admin_user,
        selectedUserId,
        setSelectedUserId,
        fetch_user_statuses,
        all_followings,
        statuses,
        setStatuses,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
