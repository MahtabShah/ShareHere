import { useContext, createContext, useEffect, useState } from "react";

const VibeContext = createContext();

export const useEditor = () => useContext(VibeContext) || {};

export const VibeEditorProvider = ({ children }) => {
  const [formatting, setFormatting] = useState({
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "left",
    listType: null,
    fontSize: "16px",
    fontFamily: "Arial",
  });
  return (
    <VibeContext.Provider
      value={{
        setFormatting,
        formatting,
      }}
    >
      {children}
    </VibeContext.Provider>
  );
};
