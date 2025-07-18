import { useState } from "react";
import { createContext, useContext } from "react";

const Theme = createContext();

export const useTheme = () => useContext(Theme) || {};

export const ThemeProvider = ({ children }) => {
  const [mainbg, setMainBg] = useState("#000");
  const [text_clrH, setText_clrH] = useState("#eee");
  const [text_clrM, setText_clrM] = useState("#bbb");
  const [text_clrL, setText_clrL] = useState("#333");

  return (
    <Theme.Provider
      value={{
        mainbg,
        setMainBg,
        text_clrH,
        setText_clrH,
        text_clrL,
        setText_clrL,
        text_clrM,
        setText_clrM,
      }}
    >
      {children}
    </Theme.Provider>
  );
};
