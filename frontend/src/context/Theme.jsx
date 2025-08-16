import { use, useState, useEffect } from "react";
import { createContext, useContext } from "react";

const Theme = createContext();

export const useTheme = () => useContext(Theme) || {};

export const ThemeProvider = ({ children }) => {
  const theme = localStorage.getItem("theme") || "light"; // Default to light theme if not set
  const [themeType, setThemeType] = useState(theme);

  const [mainbg, setMainBg] = useState(
    themeType === "dark" ? "#040404b3" : "#f6fafeff"
  );
  const [bg1, setBg1] = useState(
    themeType === "dark" ? "#000000ff" : "#f5f9feff"
  );
  const [bg2, setBg2] = useState(
    themeType === "dark" ? "#121520ff" : "#e9edf1ff"
  );
  const [bg3, setBg3] = useState(
    themeType === "dark" ? "#a4a2a2ff" : "#d5dee3ff"
  );

  const [text_clrH, setText_clrH] = useState(
    themeType === "dark" ? "#eeeeee" : "#000911ff"
  );
  const [text_clrM, setText_clrM] = useState(
    themeType === "dark" ? "#c3c2c2ff" : "#222222ff"
  );
  const [text_clrL, setText_clrL] = useState(
    themeType === "dark" ? "#9b9b9bff" : "#bbbbbbff"
  );

  document.body.style.background = bg2;

  useEffect(() => {
    if (themeType === "dark") {
      setMainBg("#040404b3");
      setBg1("#010105ff");
      setBg2("#0b0d14ff");
      setBg3("#a4a2a2ff");
      setText_clrH("#eeeeee");
      setText_clrM("#c3c2c2ff");
      setText_clrL("#9b9b9bff");
      document.body.style.background = bg2;
      localStorage.setItem("theme", "dark");
    } else {
      setMainBg("#f6fafeff");
      setBg1("#f5f9feff");
      setBg2("#e0e6ecff");
      setBg3("#d5dee3ff");
      setText_clrH("#000911ff");
      setText_clrM("#222222ff");
      setText_clrL("#bbbbbbff");
      document.body.style.background = bg2;
      localStorage.setItem("theme", "light");
    }
  }, [themeType, theme]);

  return (
    <Theme.Provider
      value={{
        mainbg,
        setMainBg,
        text_clrH,
        setText_clrH,
        text_clrL,
        bg1,
        bg2,
        bg3,
        setText_clrL,
        text_clrM,
        setText_clrM,
        setThemeType,
      }}
    >
      {children}
    </Theme.Provider>
  );
};
