// QuoteContext.js
import React, { createContext, useContext, useState } from "react";

const QuoteContext = createContext();

export const useQuote = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
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
    <QuoteContext.Provider value={{ quote, setQuote, style, setStyle }}>
      {children}
    </QuoteContext.Provider>
  );
};
