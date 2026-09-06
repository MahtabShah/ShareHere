import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faMoon,
  faSun,
  faBars,
  faCompass,
  faSquarePlus,
  faRightFromBracket,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "../../TinyComponent/Logo";
import { useQuote } from "../context/QueotrContext";
import axios from "axios";
import { SearchBaar } from "../../TinyComponent/SearchBaar";
import { useTheme } from "../context/Theme";
import { getActiveNavFromPath } from "../context/navUtils";

export const NotificationBell = () => {
  const { textPrimary, bgSurface } = useTheme();
  const location = useLocation();
  const {
    curr_all_notifications,
    setcurr_all_notifications,
    setopenSlidWin,
    openSlidWin,
    setActiveIndex,
    API,
    token,
    count,
    setCount,
  } = useQuote();

  useEffect(() => {
    if (curr_all_notifications && curr_all_notifications?.length > 0) {
      const length =
        curr_all_notifications?.filter((n) => n?.isRead === false)?.length || 0;
      setCount(length);
    }
  }, [curr_all_notifications, setCount]);

  const Mark_as_read_notification = async () => {
    setCount(0);

    try {
      const res = await axios.put(
        `${API}/api/crud/crud_mark_notification`,
        { curr_all_notifications },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setcurr_all_notifications(res.data);
    } catch (error) {
      console.log("error in notification", error);
    }
  };

  const HandleBellIcon = () => {
    if (openSlidWin) {
      setopenSlidWin(false);
      setActiveIndex(getActiveNavFromPath(location.pathname));
    } else {
      setActiveIndex("Notifications");
      setopenSlidWin(true);
      Mark_as_read_notification();
    }
  };

  return (
    <button
      type="button"
      className="btn p-0 d-flex align-items-center justify-content-center border-0 shadow-none position-relative"
      onClick={HandleBellIcon}
      title="Notifications"
      aria-label="View Notifications"
      style={{
        cursor: "pointer",
        color: textPrimary,
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "transparent",
        transition: "background 0.2s ease",
      }}>
      <div
        className="d-flex align-items-center justify-content-center position-relative"
        style={{ width: "22px", height: "22px" }}>
        {count > 0 && (
          <span
            className="position-absolute bg-danger text-light d-flex align-items-center justify-content-center rounded-circle fw-bold"
            style={{
              top: "-4px",
              right: "-6px",
              fontSize: "0.6rem",
              minWidth: "17px",
              height: "17px",
              padding: "0 2px",
              zIndex: 2,
              border: `1.5px solid ${bgSurface}`,
            }}>
            {count > 9 ? "9+" : count}
          </span>
        )}
        <FontAwesomeIcon icon={faBell} style={{ fontSize: "17px" }} />
      </div>
    </button>
  );
};

function MainHeader({ onLogout } = {}) {
  const [smbreakPoint, setsmbreakPoint] = useState(window.innerWidth < 600);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const {
    admin_user,
    mobile_bp,
    setActiveIndex,
    setIsLeftNavOpen,
    isNavCollapsed,
  } = useQuote();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setShowUserMenu(false);
    if (onLogout) onLogout();
    navigate("/home");
    window.location.reload();
  };

  useEffect(() => {
    const handleResize = () => {
      setsmbreakPoint(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dismiss user dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [showUserMenu]);

  const {
    textPrimary,
    textSecondary,
    textMuted,
    bgSurface,
    bgSubtle,
    bgBorder,
    toggleTheme,
    isDark,
  } = useTheme();

  const [fading, setFading] = useState(false);

  const handleToggleTheme = () => {
    setFading(true);
    setTimeout(() => {
      toggleTheme();
      setFading(false);
    }, 200);
  };

  const handleNavigate = (page, path) => {
    setActiveIndex(page);
    setShowUserMenu(false);
    navigate(path);
  };

  return (
    <Navbar
      className="p-0 main-app-header"
      variant="light"
      fixed="top"
      style={{
        background: bgSurface,
        borderBottom: `1px solid ${bgBorder}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 99,
        left: `${mobile_bp ? "0px" : isNavCollapsed ? "74px" : "244px"}`,
        right: "0px",
        width: `${
          mobile_bp
            ? "100%"
            : isNavCollapsed
              ? "calc(100% - 74px)"
              : "calc(100% - 244px)"
        }`,
        height: "54px",
        transition:
          "left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
      <Container
        fluid
        className="h-100 px-3"
        style={{
          position: "relative",
          zIndex: 999106,
        }}>
        <div className="d-flex align-items-center justify-content-between w-100 h-100 gap-2">
          {/* Left: Mobile Drawer Trigger or Collapsed Brand Badge */}
          <div
            className="d-flex align-items-center gap-2 flex-shrink-0"
            style={{
              flex: mobile_bp ? "0 0 auto" : "0 1 0",
              minWidth: mobile_bp ? "auto" : "80px",
            }}>
            {mobile_bp ? (
              <button
                type="button"
                className="btn p-1 d-flex align-items-center justify-content-center border-0 shadow-none"
                onClick={() => setIsLeftNavOpen((prev) => !prev)}
                title="Toggle Navigation Menu"
                aria-label="Toggle Navigation Menu"
                style={{
                  background: "transparent",
                  color: textPrimary,
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}>
                <FontAwesomeIcon icon={faBars} style={{ fontSize: "17px" }} />
              </button>
            ) : isNavCollapsed ? (
              <div
                className="d-flex align-items-center gap-2 cursor-pointer me-1"
                onClick={() => handleNavigate("Home", "/home")}
                title="Go to Home"
                style={{ cursor: "pointer" }}>
                <span
                  className="fw-bold tracking-tight"
                  style={{
                    fontSize: "15px",
                    background: "linear-gradient(135deg, #ff3c78, #e1306c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "0.5px",
                  }}>
                  VIBE INK
                </span>
              </div>
            ) : null}
          </div>

          {/* Center: Search Bar */}
          <div
            className="d-flex  w-100 flex-grow-1 px-1"
            style={{
              // flex: "1 1 auto",
              maxWidth: "540px",
              minWidth: "0",
            }}>
            <SearchBaar />
          </div>

          {/* Right: Quick Action Options */}
          <div
            className="d-flex align-items-center justify-content-end gap-1 gap-sm-2 flex-shrink-0"
            style={{
              flex: "0 0 auto",
              minWidth: "auto",
            }}>
            {/* Explore Shortcut (hidden on very small screens) */}
            {/* <button
              type="button"
              className="btn p-0 d-none d-md-flex align-items-center gap-1 border-0 shadow-none px-2 flex-shrink-0"
              onClick={() => handleNavigate("Explore", "/Explore")}
              title="Explore Trending Vibes"
              style={{
                background: "transparent",
                color: textSecondary,
                height: "34px",
                borderRadius: "20px",
                fontSize: "13.5px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "color 0.2s, background 0.2s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}>
              <FontAwesomeIcon icon={faCompass} style={{ fontSize: "16px" }} />
              <span className="d-none d-lg-inline">Explore</span>
            </button> */}

            {/* Quick Create Vibe Button (hidden on mobile, accessible in BottomNav) */}
            <button
              type="button"
              className="btn border-0 d-none d-sm-flex align-items-center justify-content-center gap-2 shadow-sm flex-shrink-0"
              onClick={() => handleNavigate("Create", "/Editor")}
              title="Create New Vibe"
              style={{
                background: "linear-gradient(135deg, #ff3c78, #e1306c)",
                color: "#ffffff",
                height: "34px",
                padding: smbreakPoint ? "0 10px" : "0 14px",
                borderRadius: "18px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.15s ease, opacity 0.2s ease",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}>
              <FontAwesomeIcon
                icon={faSquarePlus}
                style={{ fontSize: "15px" }}
              />
              {!smbreakPoint && <span>Create</span>}
            </button>

            {/* Notifications Bell with Badge (hidden on mobile, accessible in BottomNav) */}
            <div className="d-none d-sm-block flex-shrink-0">
              <NotificationBell />
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              className="btn p-0 d-flex align-items-center justify-content-center border-0 shadow-none flex-shrink-0"
              onClick={handleToggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
              style={{
                background: "transparent",
                color: textPrimary,
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                fontSize: "16px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                flexShrink: 0,
              }}>
              <FontAwesomeIcon
                icon={isDark ? faSun : faMoon}
                className={`theme-icon ${fading ? "fade-out" : ""}`}
                style={{ fontSize: "17px" }}
              />
            </button>

            {/* User Profile Avatar with Dropdown Menu (on mobile, user profile is in BottomNav) */}
            {loggedIn && admin_user?._id && (
              <div
                className="position-relative d-none d-sm-block"
                ref={userMenuRef}
                style={{
                  zIndex: "991060 !important",
                }}>
                <button
                  type="button"
                  className="btn p-0 d-flex align-items-center gap-1 border-0 shadow-none"
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  title={
                    admin_user?.username
                      ? `@${admin_user.username}`
                      : "My Account"
                  }
                  style={{
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}>
                  <div
                    className="d-flex align-items-center justify-content-center overflow-hidden"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: `2px solid ${
                        showUserMenu
                          ? "var(--accent-primary, #e1306c)"
                          : bgBorder
                      }`,
                      background:
                        admin_user?.bg_clr ||
                        "linear-gradient(135deg, #6366f1, #a855f7)",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "13px",
                      transition: "border-color 0.2s ease",
                    }}>
                    {admin_user?.profile_pic ? (
                      <img
                        src={admin_user.profile_pic}
                        alt="avatar"
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <span>
                        {admin_user?.username?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    style={{
                      fontSize: "10px",
                      color: textMuted,
                      transition: "transform 0.2s",
                      transform: showUserMenu
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* Interactive User Dropdown Card */}
                {showUserMenu && (
                  <div
                    className="position-absolute border rounded-3 shadow-lg p-2"
                    style={{
                      top: "42px",
                      right: "0px",
                      width: "230px",
                      background: bgSurface,
                      border: `1px solid ${bgBorder}`,
                      zIndex: 991060,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                      animation: "fadeInBackdrop 0.15s ease",
                    }}>
                    {/* User Profile Header */}
                    <div
                      className="d-flex align-items-center gap-2 p-2 rounded-2 mb-1 cursor-pointer"
                      onClick={() =>
                        handleNavigate("User", `/api/user/${admin_user._id}`)
                      }
                      style={{
                        background: bgSubtle,
                        cursor: "pointer",
                      }}>
                      <div
                        className="d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background:
                            admin_user?.bg_clr ||
                            "linear-gradient(135deg, #6366f1, #a855f7)",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}>
                        {admin_user?.profile_pic ? (
                          <img
                            src={admin_user.profile_pic}
                            alt="avatar"
                            className="w-100 h-100 object-fit-cover"
                          />
                        ) : (
                          <span>
                            {admin_user?.username?.[0]?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <div className="d-flex flex-column overflow-hidden text-start">
                        <span
                          className="fw-bold text-truncate"
                          style={{ fontSize: "13px", color: textPrimary }}>
                          {admin_user?.name || admin_user?.username}
                        </span>
                        <span
                          className="text-truncate"
                          style={{ fontSize: "11px", color: textMuted }}>
                          @{admin_user?.username}
                        </span>
                      </div>
                    </div>

                    <div
                      className="my-1"
                      style={{ height: "1px", background: bgBorder }}
                    />

                    {/* Dropdown Menu Items */}
                    <button
                      type="button"
                      className="btn w-100 d-flex align-items-center gap-2 text-start p-2 border-0 shadow-none rounded-2"
                      onClick={() =>
                        handleNavigate("User", `/api/user/${admin_user._id}`)
                      }
                      style={{
                        color: textPrimary,
                        fontSize: "13px",
                        background: "transparent",
                        cursor: "pointer",
                      }}>
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ width: "16px", color: textMuted }}
                      />
                      <span>My Profile</span>
                    </button>

                    <button
                      type="button"
                      className="btn w-100 d-flex align-items-center gap-2 text-start p-2 border-0 shadow-none rounded-2"
                      onClick={() => handleNavigate("Create", "/Editor")}
                      style={{
                        color: textPrimary,
                        fontSize: "13px",
                        background: "transparent",
                        cursor: "pointer",
                      }}>
                      <FontAwesomeIcon
                        icon={faSquarePlus}
                        style={{ width: "16px", color: textMuted }}
                      />
                      <span>Create Vibe</span>
                    </button>

                    <button
                      type="button"
                      className="btn w-100 d-flex align-items-center gap-2 text-start p-2 border-0 shadow-none rounded-2"
                      onClick={() => handleNavigate("Explore", "/Explore")}
                      style={{
                        color: textPrimary,
                        fontSize: "13px",
                        background: "transparent",
                        cursor: "pointer",
                      }}>
                      <FontAwesomeIcon
                        icon={faCompass}
                        style={{ width: "16px", color: textMuted }}
                      />
                      <span>Explore Vibes</span>
                    </button>

                    <div
                      className="my-1"
                      style={{ height: "1px", background: bgBorder }}
                    />

                    <button
                      type="button"
                      className="btn w-100 d-flex align-items-center gap-2 text-start p-2 border-0 shadow-none rounded-2"
                      onClick={handleLogout}
                      style={{
                        color: "#dc3545",
                        fontSize: "13px",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}>
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                        style={{ width: "16px" }}
                      />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default MainHeader;
