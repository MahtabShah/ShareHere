// -------------- Done ------------------------------

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuote } from "../src/context/QueotrContext";
export const btnclass = "btn btn-sm progressBtn text-white ps-4 pe-4 rounded-5";
import Nav from "react-bootstrap/Nav";
import {
  faUser,
  faHouse,
  faSquarePlus,
  faCompass,
} from "@fortawesome/free-solid-svg-icons";

import { NotificationBell } from "../src/maincomponents/MainHeader";
import { useTheme } from "../src/context/Theme";
import { getActiveNavFromPath } from "../src/context/navUtils";

export default function BottomNav({}) {
  const {
    admin_user,
    token,
    mobile_break_point,
    setActiveIndex,
    activeIndex,
    openSlidWin,
    setopenSlidWin,
  } = useQuote();
  const [loggedIn, setLoggedIn] = useState(() => {
    return !!(
      token ||
      (typeof localStorage !== "undefined" && localStorage.getItem("token"))
    );
  });
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile =
    mobile_break_point ||
    (typeof window !== "undefined" && window.innerWidth <= 768);

  // Normalize nav keys to consistent capitalized form
  const normalizeNav = (val) => {
    if (!val) return "Home";
    const l = String(val).toLowerCase();
    if (l === "home") return "Home";
    if (l === "explore") return "Explore";
    if (l === "upload" || l === "create" || l === "editor") return "Upload";
    if (l === "notifications") return "Notifications";
    if (l === "user" || l === "profile" || l === "signup" || l === "login")
      return "User";
    return val;
  };

  const currentNavFromPath = getActiveNavFromPath(location.pathname);
  const effectiveActiveNav = openSlidWin
    ? "Notifications"
    : normalizeNav(activeIndex) === "Notifications"
      ? currentNavFromPath
      : normalizeNav(activeIndex || currentNavFromPath);

  // Sync activeIndex with route changes automatically
  useEffect(() => {
    const matched = getActiveNavFromPath(location.pathname);
    if (matched && !openSlidWin) {
      setActiveIndex(matched);
    }
  }, [location.pathname, openSlidWin, setActiveIndex]);

  useEffect(() => {
    const currentToken = token || localStorage.getItem("token");
    setLoggedIn(!!currentToken);
  }, [token]);

  const { textPrimary, bgSurface, bgBorder, isDark } = useTheme();

  const navItems = [
    {
      key: "Home",
      label: "Home",
      icon: faHouse,
      href: "/home",
      onClick: () => {
        setopenSlidWin(false);
        setActiveIndex("Home");
      },
    },
    {
      key: "Explore",
      label: "Explore",
      icon: faCompass,
      href: "/Explore",
      onClick: () => {
        setopenSlidWin(false);
        setActiveIndex("Explore");
      },
    },
    {
      key: "Upload",
      label: "Create",
      icon: faSquarePlus,
      href: "/Editor",
      onClick: () => {
        setopenSlidWin(false);
        setActiveIndex("Upload");
      },
    },
  ];

  const activeBg = isDark
    ? "rgba(255, 60, 120, 0.16)"
    : "rgba(225, 48, 108, 0.12)";
  const activeColor = "var(--accent-primary, #e1306c)";

  return (
    <nav
      className="BottomNav position-fixed"
      aria-label="Mobile Bottom Navigation"
      style={{
        height: "64px",
        background: bgSurface,
        borderTop: `1px solid ${bgBorder}`,
        boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.08)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
      <div
        className="h-100 mx-auto px-2"
        style={{
          maxWidth: "600px",
          width: "100%",
        }}>
        <ul className="nav nav-pills w-100 h-100 d-flex justify-content-around align-items-center m-0 p-0">
          {/* Dynamic Nav Items */}
          {navItems.map((item) => {
            const isActive = effectiveActiveNav === item.key;
            return (
              <li className="nav-item" key={item.key}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    item.onClick();
                    navigate(item.href);
                  }}
                  className={`nav-link border-0 p-0 d-flex flex-column align-items-center justify-content-center position-relative ${
                    isActive ? "active" : ""
                  }`}
                  style={{
                    background: isActive ? activeBg : "transparent",
                    color: isActive ? activeColor : textPrimary,
                    borderRadius: "12px",
                    minWidth: "48px",
                    minHeight: "44px",
                    padding: "4px 8px",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "24px",
                      height: "24px",
                      transform: isActive ? "scale(1.12)" : "scale(1)",
                      transition: "transform 0.2s ease",
                    }}>
                    <FontAwesomeIcon icon={item.icon} fontSize={18} />
                  </div>
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "3px",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: activeColor,
                      }}
                    />
                  )}
                </button>
              </li>
            );
          })}

          {/* Notifications */}
          <li className="nav-item">
            {(() => {
              const isNotifActive = effectiveActiveNav === "Notifications";
              return (
                <div
                  className={`nav-link border-0 p-0 d-flex flex-column align-items-center justify-content-center position-relative ${
                    isNotifActive ? "active" : ""
                  }`}
                  style={{
                    background: isNotifActive ? activeBg : "transparent",
                    color: isNotifActive ? activeColor : textPrimary,
                    borderRadius: "12px",
                    minWidth: "48px",
                    minHeight: "44px",
                    padding: "4px 8px",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}>
                  <div
                    style={{
                      transform: isNotifActive ? "scale(1.12)" : "scale(1)",
                      transition: "transform 0.2s ease",
                    }}>
                    <NotificationBell />
                  </div>
                  {isNotifActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "3px",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: activeColor,
                      }}
                    />
                  )}
                </div>
              );
            })()}
          </li>

          {/* User Profile / Signup */}
          <li className="nav-item">
            {(() => {
              const isUserActive = effectiveActiveNav === "User";
              if (loggedIn && admin_user?._id) {
                return (
                  <button
                    type="button"
                    className={`nav-link border-0 p-0 d-flex flex-column align-items-center justify-content-center position-relative ${
                      isUserActive ? "active" : ""
                    }`}
                    style={{
                      background: isUserActive ? activeBg : "transparent",
                      color: isUserActive ? activeColor : textPrimary,
                      borderRadius: "12px",
                      minWidth: "48px",
                      minHeight: "44px",
                      padding: "4px 8px",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onClick={() => {
                      setopenSlidWin(false);
                      setActiveIndex("User");
                      navigate(`/api/user/${admin_user._id}`);
                    }}>
                    <div
                      style={{
                        transform: isUserActive ? "scale(1.12)" : "scale(1)",
                        transition: "transform 0.2s ease",
                      }}>
                      {admin_user?.profile_pic ? (
                        <img
                          src={admin_user.profile_pic}
                          alt={admin_user.username}
                          className="rounded-circle"
                          style={{
                            width: "26px",
                            height: "26px",
                            objectFit: "cover",
                            border: isUserActive
                              ? `2px solid ${activeColor}`
                              : "none",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{
                            width: "26px",
                            height: "26px",
                            fontSize: "12px",
                            background: admin_user?.bg_clr || "#e1306c",
                            border: isUserActive
                              ? `2px solid ${activeColor}`
                              : "none",
                          }}>
                          {(admin_user?.username || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    {isUserActive && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "3px",
                          width: "4px",
                          height: "4px",
                          borderRadius: "50%",
                          backgroundColor: activeColor,
                        }}
                      />
                    )}
                  </button>
                );
              }
              return (
                <button
                  type="button"
                  className={`nav-link border-0 p-0 d-flex flex-column align-items-center justify-content-center position-relative ${
                    isUserActive ? "active" : ""
                  }`}
                  style={{
                    background: isUserActive ? activeBg : "transparent",
                    color: isUserActive ? activeColor : textPrimary,
                    borderRadius: "12px",
                    minWidth: "48px",
                    minHeight: "44px",
                    padding: "4px 8px",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onClick={() => {
                    setopenSlidWin(false);
                    setActiveIndex("User");
                    navigate("/signup");
                  }}>
                  <div
                    style={{
                      transform: isUserActive ? "scale(1.12)" : "scale(1)",
                      transition: "transform 0.2s ease",
                    }}>
                    <FontAwesomeIcon icon={faUser} fontSize={18} />
                  </div>
                  {isUserActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "3px",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: activeColor,
                      }}
                    />
                  )}
                </button>
              );
            })()}
          </li>
        </ul>
      </div>
    </nav>
  );
}
