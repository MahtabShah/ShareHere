/**
 * Semantic Theme Tokens and Design System for Vibe Ink
 * Provides cohesive color palettes and tokens for both Light and Dark themes.
 */
export const themePalettes = {
  light: {
    // Theme metadata
    themeName: "light",
    themeLabel: "Light Mode",

    // Layout & Surface Backgrounds
    bgPage: "#f8fafc",          // Canvas / page background
    bgSurface: "#ffffff",       // Elevated surfaces: headers, sidebars, cards, modals
    bgCard: "#ffffff",          // Main content cards
    bgMain: "#ffffff",          // Alias for main content card
    bgSubtle: "#f1f5f9",        // Badges, chips, search inputs, active highlight backgrounds
    borderColor: "#e2e8f0",     // Crisp borders and divider lines
    bgBorder: "#e2e8f0",        // Alias for borders
    borderSubtle: "#f1f5f9",    // Ultra soft dividers

    // Typography (WCAG AA/AAA Compliant)
    textPrimary: "#0f172a",     // Headings, titles, high-contrast text
    textSecondary: "#334155",   // Post descriptions, body copy, active icons
    textMuted: "#64748b",       // Timestamps, helper notes, placeholders

    // Brand & Interactive Accents
    accentColor: "#ff3c78",     // Signature Vibe Ink vibrant magenta
    accent: "#ff3c78",
    accentHover: "#e02868",     // Hover state for accent buttons
    accentMuted: "rgba(255, 60, 120, 0.08)", // Translucent accent for badge backgrounds
    cardHover: "#f8fafc",       // Hover background for post items
    shadowSm: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
    shadowMd: "0 4px 12px rgba(15, 23, 42, 0.08)",
  },
  dark: {
    // Theme metadata
    themeName: "dark",
    themeLabel: "Dark Mode",

    // Layout & Surface Backgrounds
    bgPage: "#0b0f19",          // Deep obsidian/midnight canvas
    bgSurface: "#111827",       // Elevated dark cards, navigation, modals
    bgCard: "#111827",          // Main content card containers
    bgMain: "#111827",          // Alias for main content card
    bgSubtle: "#1f293d",        // Input fills, pills, chips, secondary surfaces
    borderColor: "#1f293d",     // Refined dark borders & dividers
    bgBorder: "#1f293d",        // Alias for borders
    borderSubtle: "#161e2e",    // Subtle dividers

    // Typography (Crisp contrast on dark background)
    textPrimary: "#f8fafc",     // Headings, titles, vibrant white
    textSecondary: "#cbd5e1",   // Clear body text, post descriptions
    textMuted: "#8b9ab4",       // Timestamps, secondary labels, icons

    // Brand & Interactive Accents
    accentColor: "#ff3c78",     // Signature Vibe Ink vibrant magenta
    accent: "#ff3c78",
    accentHover: "#ff578f",     // Brighter hover on dark mode
    accentMuted: "rgba(255, 60, 120, 0.18)", // Soft accent glow
    cardHover: "#161f32",       // Hover state for cards
    shadowSm: "0 1px 3px rgba(0, 0, 0, 0.45)",
    shadowMd: "0 4px 16px rgba(0, 0, 0, 0.6)",
  },
};
