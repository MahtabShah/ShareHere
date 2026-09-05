import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHouse,
  faSquarePlus,
  faBell,
  faCompass,
  faRightFromBracket,
  faRightToBracket,
  faChevronLeft,
  faChevronRight,
  faXmark,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useQuote } from "../context/QueotrContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Notification } from "../../TinyComponent/Notification";
import { useTheme } from "../context/Theme";
import { getActiveNavFromPath } from "../context/navUtils";

export default function LeftNavbar({ onLogout } = {}) {
  const {
    admin_user,
    mobile_break_point,
    openSlidWin,
    setopenSlidWin,
    activeIndex,
    setActiveIndex,
    setVisibleNotification,
    count,
    setCount,
    isLeftNavOpen,
    setIsLeftNavOpen,
    isNavCollapsed,
    setIsNavCollapsed,
  } = useQuote();

  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentNavFromPath = getActiveNavFromPath(location.pathname);
  const effectiveActiveNav = openSlidWin
    ? "Notifications"
    : activeIndex === "Notifications"
      ? currentNavFromPath
      : activeIndex || currentNavFromPath;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/home");
    window.location.reload();
    if (onLogout) onLogout();
  };

  useEffect(() => {
    if (activeIndex === "Notifications" && openSlidWin) {
      document.querySelector("html")?.classList.add("no-scroll");
    } else {
      document.querySelector("html")?.classList.remove("no-scroll");
    }
  }, [activeIndex, openSlidWin]);

  const {
    textPrimary,
    textSecondary,
    textMuted,
    bgPage,
    bgSurface,
    bgSubtle,
    bgBorder,
    toggleTheme,
    isDark,
  } = useTheme();

  const handleNavClick = (key, path) => {
    setopenSlidWin(false);
    setActiveIndex(key);
    if (mobile_break_point) {
      setIsLeftNavOpen(false);
    }
    if (path) {
      navigate(path);
    }
  };

  const handleNotificationsClick = () => {
    if (mobile_break_point) {
      setIsLeftNavOpen(false);
    }
    setCount(0);
    if (openSlidWin) {
      setopenSlidWin(false);
      setActiveIndex(getActiveNavFromPath(location.pathname));
    } else {
      setopenSlidWin(true);
      setActiveIndex("Notifications");
    }
  };

  // Content for navigation links (used in both desktop sidebar and mobile drawer)
  const renderNavItems = (isDrawer = false) => {
    const isCollapsed = !isDrawer && isNavCollapsed;

    return (
      <div className="d-flex flex-column h-100 justify-content-between">
        {/* Top Navigation Group */}
        <div className="d-flex flex-column gap-1">
          {/* Home Link */}
          <div
            className={`nav-link d-flex align-items-center ${isCollapsed ? "justify-content-center px-0" : "gap-3 px-3"} py-2 ${
              effectiveActiveNav === "Home" ? "active" : ""
            }`}
            onClick={() => handleNavClick("Home", "/home")}
            title="Home"
            style={{
              cursor: "pointer",
              color:
                effectiveActiveNav === "Home"
                  ? "var(--accent-primary, #e1306c)"
                  : textPrimary,
              borderRadius: "10px",
            }}>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "24px", height: "24px" }}>
              <FontAwesomeIcon icon={faHouse} fontSize={18} />
            </div>
            {!isCollapsed && (
              <span
                className="fw-semibold text-truncate"
                style={{ fontSize: "15px" }}>
                Home
              </span>
            )}
          </div>

          {/* Explore Link */}
          {/* <div
            className={`nav-link d-flex align-items-center ${isCollapsed ? "justify-content-center px-0" : "gap-3 px-3"} py-2 ${
              effectiveActiveNav === "Explore" ? "active" : ""
            }`}
            onClick={() => handleNavClick("Explore", "/Explore")}
            title="Explore"
            style={{
              cursor: "pointer",
              color: effectiveActiveNav === "Explore" ? "var(--accent-primary, #e1306c)" : textPrimary,
              borderRadius: "10px",
            }}>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "24px", height: "24px" }}>
              <FontAwesomeIcon icon={faCompass} fontSize={18} />
            </div>
            {!isCollapsed && (
              <span className="fw-semibold text-truncate" style={{ fontSize: "15px" }}>
                Explore
              </span>
            )}
          </div> */}

          {/* Create Vibe / Upload Link */}
          <div
            className={`nav-link d-flex align-items-center ${isCollapsed ? "justify-content-center px-0" : "gap-3 px-3"} py-2 ${
              effectiveActiveNav === "Upload" ? "active" : ""
            }`}
            onClick={() => handleNavClick("Upload", "/Editor")}
            title="Create Vibe"
            style={{
              cursor: "pointer",
              color:
                effectiveActiveNav === "Upload"
                  ? "var(--accent-primary, #e1306c)"
                  : textPrimary,
              borderRadius: "10px",
            }}>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "24px", height: "24px" }}>
              <FontAwesomeIcon icon={faSquarePlus} fontSize={19} />
            </div>
            {!isCollapsed && (
              <span
                className="fw-semibold text-truncate"
                style={{ fontSize: "15px" }}>
                Create Vibe
              </span>
            )}
          </div>

          {/* Notifications Link */}
          <div
            className={`nav-link d-flex align-items-center ${isCollapsed ? "justify-content-center px-0" : "gap-3 px-3"} py-2 ${
              effectiveActiveNav === "Notifications" && openSlidWin
                ? "active"
                : ""
            }`}
            onClick={handleNotificationsClick}
            title="Notifications"
            style={{
              cursor: "pointer",
              color:
                effectiveActiveNav === "Notifications" && openSlidWin
                  ? "var(--accent-primary, #e1306c)"
                  : textPrimary,
              borderRadius: "10px",
            }}>
            <div
              className="d-flex align-items-center justify-content-center position-relative"
              style={{ width: "24px", height: "24px" }}>
              {count > 0 && (
                <span
                  className="position-absolute bg-danger text-light rounded-circle fw-bold d-flex align-items-center justify-content-center"
                  style={{
                    top: "-4px",
                    right: "-6px",
                    fontSize: "0.55rem",
                    minWidth: "16px",
                    height: "16px",
                    padding: "0 2px",
                    zIndex: 2,
                    border: `1px solid ${bgSurface}`,
                  }}>
                  {count > 9 ? "9+" : count}
                </span>
              )}
              <FontAwesomeIcon icon={faBell} fontSize={18} />
            </div>
            {!isCollapsed && (
              <span
                className="fw-semibold text-truncate"
                style={{ fontSize: "15px" }}>
                Notifications
              </span>
            )}
          </div>

          {/* User Profile or Sign In */}
          {loggedIn && admin_user?._id ? (
            <div
              className={`nav-link d-flex align-items-center ${isCollapsed ? "justify-content-center px-0" : "gap-3 px-3"} py-2 ${
                effectiveActiveNav === "User" ? "active" : ""
              }`}
              onClick={() =>
                handleNavClick("User", `/api/user/${admin_user._id}`)
              }
              title={
                admin_user?.username ? `@${admin_user.username}` : "Profile"
              }
              style={{
                cursor: "pointer",
                color:
                  effectiveActiveNav === "User"
                    ? "var(--accent-primary, #e1306c)"
                    : textPrimary,
                borderRadius: "10px",
              }}>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ width: "24px", height: "24px" }}>
                {admin_user?.profile_pic ? (
                  <img
                    src={admin_user.profile_pic}
                    alt={admin_user.username}
                    className="rounded-circle"
                    style={{
                      width: "24px",
                      height: "24px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{
                      width: "24px",
                      height: "24px",
                      fontSize: "12px",
                      background: admin_user?.bg_clr || "#e1306c",
                    }}>
                    {(admin_user?.username || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <div
                  className="d-flex flex-column text-truncate"
                  style={{ lineHeight: 1.2 }}>
                  <span
                    className="fw-semibold text-truncate"
                    style={{ fontSize: "14px" }}>
                    {admin_user?.name || `@${admin_user?.username}`}
                  </span>
                  <small
                    className="text-truncate"
                    style={{ fontSize: "11px", color: textMuted }}>
                    View profile
                  </small>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`nav-link d-flex align-items-center ${isCollapsed ? "justify-content-center px-0" : "gap-3 px-3"} py-2 ${
                effectiveActiveNav === "User" ? "active" : ""
              }`}
              onClick={() => handleNavClick("User", "/signup")}
              title="Sign In / Register"
              style={{
                cursor: "pointer",
                color:
                  effectiveActiveNav === "User"
                    ? "var(--accent-primary, #e1306c)"
                    : textPrimary,
                borderRadius: "10px",
              }}>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ width: "24px", height: "24px" }}>
                <FontAwesomeIcon icon={faRightToBracket} fontSize={18} />
              </div>
              {!isCollapsed && (
                <span
                  className="fw-semibold text-truncate"
                  style={{ fontSize: "15px" }}>
                  Sign In / Register
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Utility Controls (Theme Switcher, Logout, Desktop Collapse Toggle) */}
        <div
          className="d-flex flex-column gap-1 pt-3"
          style={{ borderTop: `1px solid ${bgBorder}` }}>
          {/* Quick Theme Toggle */}
          <div
            className={`nav-link d-flex align-items-center ${isCollapsed ? "justify-content-center px-0" : "gap-3 px-3"} py-2`}
            onClick={() => toggleTheme()}
            title={isDark ? "Light Mode" : "Dark Mode"}
            style={{
              cursor: "pointer",
              color: textPrimary,
              borderRadius: "10px",
            }}>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "24px", height: "24px" }}>
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} fontSize={17} />
            </div>
            {!isCollapsed && (
              <span
                className="fw-medium text-truncate"
                style={{ fontSize: "14px" }}>
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </div>

          {/* Log Out (when logged in) */}
          {loggedIn && (
            <div
              className={`nav-link d-flex align-items-center ${isCollapsed ? "justify-content-center px-0" : "gap-3 px-3"} py-2 text-danger`}
              onClick={handleLogout}
              title="Log Out"
              style={{
                cursor: "pointer",
                borderRadius: "10px",
              }}>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ width: "24px", height: "24px" }}>
                <FontAwesomeIcon icon={faRightFromBracket} fontSize={17} />
              </div>
              {!isCollapsed && (
                <span
                  className="fw-medium text-truncate"
                  style={{ fontSize: "14px" }}>
                  Log Out
                </span>
              )}
            </div>
          )}

          {/* Desktop Collapse/Expand Toggle Button */}
          {!isDrawer && (
            <div
              className={`nav-link d-flex align-items-center ${isCollapsed ? "justify-content-center px-0" : "gap-3 px-3"} py-2 mt-1`}
              onClick={() => setIsNavCollapsed((prev) => !prev)}
              title={isNavCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{
                cursor: "pointer",
                color: textMuted,
                borderRadius: "10px",
              }}>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ width: "24px", height: "24px" }}>
                <FontAwesomeIcon
                  icon={isNavCollapsed ? faChevronRight : faChevronLeft}
                  fontSize={14}
                />
              </div>
              {!isCollapsed && (
                <span
                  className="fw-normal text-truncate"
                  style={{ fontSize: "13px" }}>
                  Collapse sidebar
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. DESKTOP & TABLET PERSISTENT LEFT NAVBAR */}
      {!mobile_break_point && (
        <aside
          className="LeftNavbar position-fixed top-0 start-0 h-100 d-flex flex-column"
          style={{
            zIndex: 991999,
            background: bgSurface,
            borderRight: `1px solid ${bgBorder}`,
            width: isNavCollapsed ? "74px" : "244px",
            transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            padding: isNavCollapsed ? "12px 8px" : "12px 14px",
          }}>
          {/* Brand Logo Header */}
          <div
            className={`d-flex align-items-center ${isNavCollapsed ? "justify-content-center" : "gap-3 px-2"} mb-4`}
            onClick={() => handleNavClick("Home", "/home")}
            style={{ cursor: "pointer", minHeight: "40px" }}
            title="Vibe Ink Home">
            <span
              className="d-inline-flex align-items-center justify-content-center text-light fw-bold"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                borderEndEndRadius: "0px",
                boxShadow: "0 0 0 2px #f8f9fa , 0 0 0 3px #111",
                background:
                  "conic-gradient(from 0deg, #ff3c78, #c71832, #ff3c78, #c71832, #ff3c78)",
                fontSize: "13px",
                flexShrink: 0,
              }}>
              AI
            </span>
            {!isNavCollapsed && (
              <span
                className="fw-bold fs-5 tracking-tight text-truncate"
                style={{
                  color: textPrimary,
                  letterSpacing: "-0.5px",
                }}>
                VIBE INK
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-grow-1 overflow-y-auto none-scroller">
            {renderNavItems(false)}
          </div>
        </aside>
      )}

      {/* 2. MOBILE SLIDE-IN OFFCANVAS DRAWER */}
      {mobile_break_point && isLeftNavOpen && (
        <>
          {/* Dark Semi-transparent Backdrop Overlay */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              zIndex: 99998,
              background: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(3px)",
              animation: "fadeInBackdrop 0.2s ease-out",
            }}
            onClick={() => setIsLeftNavOpen(false)}
          />

          {/* Drawer Container */}
          <aside
            className="position-fixed top-0 start-0 h-100 d-flex flex-column"
            style={{
              zIndex: 99999,
              width: "280px",
              maxWidth: "82vw",
              background: bgSurface,
              borderRight: `1px solid ${bgBorder}`,
              boxShadow: "4px 0 24px rgba(0, 0, 0, 0.25)",
              animation: "slideInFromLeft 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              padding: "16px 14px",
            }}>
            {/* Drawer Header with Close Button */}
            <div
              className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom"
              style={{ borderColor: bgBorder }}>
              <div
                className="d-flex align-items-center gap-2"
                onClick={() => handleNavClick("Home", "/home")}
                style={{ cursor: "pointer" }}>
                <span
                  className="d-inline-flex align-items-center justify-content-center text-light fw-bold"
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    borderEndEndRadius: "0px",
                    boxShadow: "0 0 0 2px #f8f9fa, 0 0 0 3px #111",
                    background:
                      "conic-gradient(from 0deg, #ff3c78, #c71832, #ff3c78, #c71832, #ff3c78)",
                    fontSize: "12px",
                  }}>
                  AI
                </span>
                <span className="fw-bold fs-5" style={{ color: textPrimary }}>
                  VIBE INK
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                className="btn p-1 d-flex align-items-center justify-content-center border-0 shadow-none"
                onClick={() => setIsLeftNavOpen(false)}
                title="Close Menu"
                aria-label="Close navigation menu"
                style={{
                  background: "transparent",
                  color: textPrimary,
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}>
                <FontAwesomeIcon icon={faXmark} fontSize={18} />
              </button>
            </div>

            {/* Nav Items inside Drawer */}
            <div className="flex-grow-1 overflow-y-auto none-scroller">
              {renderNavItems(true)}
            </div>
          </aside>
        </>
      )}

      {/* 3. NOTIFICATIONS SLIDE PANEL */}
      {openSlidWin && (
        <>
          {/* Backdrop Overlay for Notification panel */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              zIndex: 9998,
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(2px)",
              animation: "fadeInBackdrop 0.2s ease-out",
              cursor: "pointer",
            }}
            onClick={() => {
              setopenSlidWin(false);
              setActiveIndex(getActiveNavFromPath(location.pathname));
            }}
          />

          {/* Floating Slide Panel Docked Right of LeftNavbar */}
          <div
            className="position-fixed"
            style={{
              zIndex: 999999,
              top: mobile_break_point ? "52px" : "54px",
              left: mobile_break_point
                ? "0"
                : isNavCollapsed
                  ? "74px"
                  : "244px",
              width: mobile_break_point ? "100%" : "440px",
              maxWidth: "100vw",
              height: mobile_break_point
                ? "calc(100dvh - 102px)"
                : "calc(100dvh - 54px)",
              transition: "left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              animation: "slideInFromLeft 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "4px 0 24px rgba(0, 0, 0, 0.18)",
            }}>
            <Notification setVisibleNotification={setVisibleNotification} />
          </div>
        </>
      )}
    </>
  );
}
