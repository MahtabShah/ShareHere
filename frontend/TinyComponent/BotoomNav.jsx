// -------------- Done ------------------------------

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useQuote } from "../src/context/QueotrContext";
export const btnclass = "btn btn-sm progressBtn text-white ps-4 pe-4 rounded-5";
import Nav from "react-bootstrap/Nav";
import { faUser, faHome, faPlus } from "@fortawesome/free-solid-svg-icons";

import { NotificationBell } from "../src/maincomponents/MainHeader";
import { useTheme } from "../src/context/Theme";

export default function BottomNav({}) {
  const { admin_user, sm_break_point, setActiveIndex, activeIndex } =
    useQuote();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const { text_clrH, text_clrL, bg1, bg2 } = useTheme();

  const navItems = [
    {
      key: "Home",
      label: "Home",
      icon: faHome,
      href: "/Home",
      onClick: () => {
        setActiveIndex("Home");
      },
    },
    {
      key: "Upload",
      label: "Upload",
      icon: faPlus,
      href: "/Editor",
      onClick: () => {
        setActiveIndex("Upload");
      },
    },
  ];

  return (
    <>
      {sm_break_point && (
        <>
          <div
            className="BottomNav py-1 w-100 d-sm-none position-fixed"
            style={{
              zIndex: 9000000,
              height: "48px",
              bottom: "0",
              left: "0",
              background: bg1,
              boxShadow: `0 -2px 4px ${bg2}`,
            }}
          >
            <ul className="nav nav-pills gap-3 mb-auto d-flex justify-content-around">
              {/* Dynamic Nav Items */}
              {navItems.map((item) => (
                <li className="nav-item" key={item.key}>
                  <Nav.Link
                    href={item.href}
                    onClick={() => item.onClick}
                    className={`nav-link text-dark d-flex align-items-center gap-3 fs-6 ${
                      activeIndex === item.key ? "active" : ""
                    }`}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "24px",
                        height: "24px",
                        color: text_clrH,
                      }}
                    >
                      <FontAwesomeIcon icon={item.icon} />
                    </div>
                    <span
                      className={`fw-semibold pe-5 ${
                        sm_break_point ? "d-none" : ""
                      }`}
                      style={{ width: "154px" }}
                    >
                      {item.label}
                    </span>
                  </Nav.Link>
                </li>
              ))}

              {/* Notifications */}
              <li className="nav-item">
                <div
                  className={`nav-link p-0 ${
                    activeIndex === "Notifications" ? "active" : " "
                  }`}
                  style={{ zIndex: 1005 }}
                >
                  <NotificationBell />
                </div>
              </li>

              {/* User Profile / Signup */}
              <li className="nav-item border-bottom pb-2">
                {loggedIn && admin_user?._id ? (
                  <a
                    href={`/api/user/${admin_user._id}`}
                    className={`nav-link d-flex align-items-center gap-3 fs-6 ${
                      activeIndex === "User" ? "active" : "br"
                    }`}
                    onClick={() => setActiveIndex("User")}
                  >
                    <span
                      className="d-flex align-items-center justify-content-center border rounded-1 text-danger"
                      style={{ width: "24px", height: "24px" }}
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <span
                      className={`fw-semibold text-dark ${
                        sm_break_point ? "d-none" : ""
                      }`}
                    >
                      User Profile
                    </span>
                  </a>
                ) : (
                  <Nav.Link href="/signup">
                    <FontAwesomeIcon icon={faUser} />
                  </Nav.Link>
                )}
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}
