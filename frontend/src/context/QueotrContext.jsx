// QuoteContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const QuoteContext = createContext();
const API = import.meta.env.VITE_API_URL;

export const useQuote = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
  const [isDisplayedLeftNav, setIsDisplayedLeftNav] = useState(
    window.innerWidth < 768
  );

  window.addEventListener("resize", () => {
    setIsDisplayedLeftNav(window.innerWidth < 768);
    // setlgbreakPoint(window.innerWidth > 1224);
  });

  const [statusClicked, setStatusClicked] = useState(false);
  const [duration, setDuration] = useState(3000);
  const [isPaused, setIsPaused] = useState(false);
  const [admin_user, setadmin_user] = useState(null);
  const token = localStorage.getItem("token");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetch_admin_user = async () => {
    try {
      const res = await axios.get(`${API}/api/crud/crud`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setLoading(false);
      res.data?.length === 0 ? "" : setadmin_user(res.data);
    } catch (err) {
      alert("Failed to follow see err in console", err);
      console.log("Failed to follow see err in console", err);
    }
  };

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
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
