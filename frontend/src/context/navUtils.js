export const getActiveNavFromPath = (pathname) => {
  if (!pathname) return "Home";
  const p = pathname.toLowerCase();
  if (p === "/explore" || p.startsWith("/explore")) return "Explore";
  if (p === "/editor" || p.startsWith("/editor")) return "Upload";
  if (p.startsWith("/api/user") || p === "/signup" || p === "/login") return "User";
  if (p === "/home" || p === "/" || p.startsWith("/home/")) return "Home";
  return "Home";
};
