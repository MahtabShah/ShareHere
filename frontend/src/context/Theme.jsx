import { use, useState, useEffect } from "react";
import { createContext, useContext } from "react";

const Theme = createContext();

export const useTheme = () => useContext(Theme) || {};

export const ThemeProvider = ({ children }) => {
  const theme = localStorage.getItem("theme") || "light"; // Default to light theme if not set
  const [themeType, setThemeType] = useState(theme);
  const [themeObj, setThemeObj] = useState({
    mbg: "#000000",
    bg1: "#030303",
    bg2: "#0c0c0cff",
    bg3: "#2f2f2fff",
    tc1: "#eeeeee",
    tc2: "#aaaaaa",
    tc3: "#777777",
  });

  const [mainbg, setMainBg] = useState("#f6fafeff");
  const [bg1, setBg1] = useState("#f5f9feff");
  const [bg2, setBg2] = useState("#e9edf1ff");
  const [bg3, setBg3] = useState("#9b9b9bff");
  const [text_clrH, setText_clrH] = useState("#000911ff");
  const [text_clrM, setText_clrM] = useState("#222222ff");
  const [text_clrL, setText_clrL] = useState("#bbbbbbff");

  useEffect(() => {
    if (themeType === "dark") {
      setMainBg("#040404ff");
      setBg1("#050505ff");
      setBg2("#0d0d0dff");
      setBg3("#282828ff");
      setText_clrH("#eeeeee");
      setText_clrM("#c3c2c2ff");
      setText_clrL("#9b9b9bff");
      document.body.style.background = bg2;
      localStorage.setItem("theme", "dark");
    } else {
      setMainBg("#f6fafeff");
      setBg1("#f5f9feff");
      setBg2("#e9edf1ff");
      setBg3("#b9c1c6ff");
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
