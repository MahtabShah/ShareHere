// QuoteContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

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

  const [quote, setQuote] = useState(
    "The future belongs to those who believe in the beauty of their dreams."
  );
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
        quote,
        setQuote,
        style,
        setStyle,
        isDisplayedLeftNav,
        setStatusClicked,
        statusClicked,
        duration,
        setDuration,
        isPaused,
        setIsPaused,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
