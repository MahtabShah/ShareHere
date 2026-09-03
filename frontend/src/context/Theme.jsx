import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { themePalettes } from "./themeTokens";

export const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    const defaultPalette = themePalettes.light;
    return {
      themeName: "light",
      theme: "light",
      themeLabel: "Light Mode",
      isDark: false,
      isLight: true,
      colors: defaultPalette,
      toggleTheme: () => {},
      setTheme: () => {},
      ...defaultPalette,
      // Backward-compatible aliases
      TxtHighColor: defaultPalette.textPrimary,
      text_clrM: defaultPalette.textSecondary,
      text_clrL: defaultPalette.textMuted,
      mainbg: defaultPalette.bgCard,
      bg1: defaultPalette.bgSurface,
      bg2: defaultPalette.bgPage,
      bg3: defaultPalette.bgSubtle,
      themeType: "light",
      setThemeType: () => {},
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        return stored;
      }
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  const colors = useMemo(() => {
    return themePalettes[themeName] || themePalettes.light;
  }, [themeName]);

  const isDark = themeName === "dark";
  const isLight = themeName === "light";

  const setTheme = useCallback((newTheme) => {
    const validTheme = newTheme === "dark" ? "dark" : "light";
    setThemeName(validTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", validTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeName((prevTheme) => {
      const nextTheme = prevTheme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", nextTheme);
      }
      return nextTheme;
    });
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.backgroundColor = colors.bgPage;
      document.body.style.color = colors.textPrimary;
      document.documentElement.setAttribute("data-theme", themeName);

      // Inject semantic CSS custom properties for global CSS consumption
      const root = document.documentElement;
      root.style.setProperty("--bg-page", colors.bgPage);
      root.style.setProperty("--bg-surface", colors.bgSurface);
      root.style.setProperty("--bg-card", colors.bgCard);
      root.style.setProperty("--bg-subtle", colors.bgSubtle);
      root.style.setProperty("--border-color", colors.borderColor);
      root.style.setProperty("--text-primary", colors.textPrimary);
      root.style.setProperty("--text-secondary", colors.textSecondary);
      root.style.setProperty("--text-muted", colors.textMuted);
      root.style.setProperty("--accent-color", colors.accentColor);
      root.style.setProperty("--accent-hover", colors.accentHover);
      root.style.setProperty("--accent-muted", colors.accentMuted);

      // Legacy fallback CSS vars for backwards compatibility with old stylesheets
      root.style.setProperty("--bg1", colors.bgSurface);
      root.style.setProperty("--bg2", colors.bgPage);
      root.style.setProperty("--bg3", colors.bgSubtle);
      root.style.setProperty("--mainbg", colors.bgCard);
      root.style.setProperty("--tc1", colors.textPrimary);
      root.style.setProperty("--tc2", colors.textSecondary);
    }
  }, [themeName, colors]);

  const value = useMemo(
    () => ({
      // Clean Theme State
      themeName,
      theme: themeName,
      themeLabel: colors.themeLabel,
      isDark,
      isLight,
      colors,
      toggleTheme,
      setTheme,

      // Semantic Color Tokens
      bgPage: colors.bgPage,
      bgSurface: colors.bgSurface,
      bgCard: colors.bgCard,
      bgMain: colors.bgCard,
      bgSubtle: colors.bgSubtle,
      borderColor: colors.borderColor,
      bgBorder: colors.borderColor,
      borderSubtle: colors.borderSubtle,

      // Typography Tokens
      textPrimary: colors.textPrimary,
      textSecondary: colors.textSecondary,
      textMuted: colors.textMuted,

      // Accent & Effects
      accentColor: colors.accentColor,
      accent: colors.accentColor,
      accentHover: colors.accentHover,
      accentMuted: colors.accentMuted,
      cardHover: colors.cardHover,
      shadowSm: colors.shadowSm,
      shadowMd: colors.shadowMd,

      // Backwards Compatibility Aliases
      TxtHighColor: colors.textPrimary,
      text_clrM: colors.textSecondary,
      text_clrL: colors.textMuted,
      mainbg: colors.bgCard,
      bg1: colors.bgSurface,
      bg2: colors.bgPage,
      bg3: colors.bgSubtle,
      themeType: themeName,
      setThemeType: setTheme,
    }),
    [themeName, isDark, isLight, colors, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const ThemeConsumer = ThemeContext.Consumer;
export default ThemeContext;
