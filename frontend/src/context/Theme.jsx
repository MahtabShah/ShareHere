import { use, useState, useEffect } from "react";
import { createContext, useContext } from "react";

const Theme = createContext();

export const useTheme = () => useContext(Theme) || {};

export const ThemeProvider = ({ children }) => {
  const [themeType, setThemeType] = useState("light");
  const [themeObj, setThemeObj] = useState({
    mbg: "#000000",
    bg1: "#030303",
    bg2: "#0c0c0cff",
    bg3: "#2f2f2fff",
    tc1: "#eeeeee",
    tc2: "#aaaaaa",
    tc3: "#777777",
  });

  const [mainbg, setMainBg] = useState("#f2f8ffff");
  const [bg1, setBg1] = useState("#eff5ffff");
  const [bg2, setBg2] = useState("#d5dce3ff");
  const [bg3, setBg3] = useState("#b9c1c6ff");
  const [text_clrH, setText_clrH] = useState("#000911ff");
  const [text_clrM, setText_clrM] = useState("#222222ff");
  const [text_clrL, setText_clrL] = useState("#bbbbbbff");

  useEffect(() => {
    if (themeType === "dark") {
      setMainBg("#000000");
      setBg1("#030303");
      setBg2("#0a0a0aff");
      setBg3("#2f2f2fff");
      setText_clrH("#eeeeee");
      setText_clrM("#aaaaaa");
      setText_clrL("#777777");
    } else {
      setMainBg("#f2f8ffff");
      setBg1("#eff5ffff");
      setBg2("#d5dce3ff");
      setBg3("#b9c1c6ff");
      setText_clrH("#000911ff");
      setText_clrM("#222222ff");
      setText_clrL("#bbbbbbff");
    }
  }, [themeType]);

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
