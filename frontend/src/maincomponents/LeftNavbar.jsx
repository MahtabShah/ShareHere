import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Nav from "react-bootstrap/Nav";

import {
  faEdit,
  faExternalLinkAlt,
  faLock,
  faUser,
  faGear,
  faHome,
  faBell,
  faBookOpen,
  faCircleInfo,
  faCircleQuestion,
  faSearch,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
export const btnclass = "btn btn-sm progressBtn text-white ps-4 pe-4 rounded-5";
import { useQuote } from "../context/QueotrContext";
import axios from "axios";
import { SearchBaar } from "../../TinyComponent/SearchBaar";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../TinyComponent/Notification";
const API = import.meta.env.VITE_API_URL;
import CanvasVibeEditor from "./CanvasEditor";
import { useTheme } from "../context/Theme";
import { NotificationBell } from "./MainHeader";
export default function LeftNavbar() {
  const {
    sm_break_point,
    admin_user,
    setUploadClicked,
    uploadClicked,
    mobile_break_point,
    openSlidWin,
    setopenSlidWin,
    activeIndex,
    setActiveIndex,
    setVisibleNotification,
    setCount,
  } = useQuote();

  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // fetchAllUsers();
    navigate("/home");
    window.location.reload();

    setLoggedIn(false);
    if (onLogout) onLogout();
  };

  useEffect(() => {
    if (activeIndex === "Notifications") {
      document.querySelector("html").classList.add("no-scroll");
    } else {
      if (document.querySelector("html").classList.contains("no-scroll")) {
        document.querySelector("html").classList.remove("no-scroll");
      }
    }
  }, [activeIndex]);

  const { text_clrH, text_clrL, text_clrM, mainbg, bg1, bg2, bg3 } = useTheme();

  return (
    <>
      <div
        className={`LeftNavbar d-flex h-100 position-fixed top-0 ${
          activeIndex === "Upload" ? "w-100" : ""
        }`}
        style={{ zIndex: 991999, background: bg2 }}
      >
        {!mobile_break_point && (
          <div
            className="d-flex px-2"
            style={{
              height: "100vh",
              minWidth: "max-content",
              background: bg1,
              borderRight: `1px solid ${text_clrL}`,
            }}
          >
            <ul className="nav nav-pills flex-column gap-3 mb-auto">
              <li className="nav-item   pt-1">
                <a
                  href="/home"
                  className={`nav-link d-flex align-items-center gap-3 fs-6`}
                >
                  <span
                    className={`d-flex align-items-center justify-content-center text-light`}
                    style={{
                      width: "24px",
                      height: "24px",
                      // borderRadius: "50%",
                      borderEndEndRadius: "0px",
                      boxShadow: "0 0 0 2px #f8f9fa , 0 0 0 3px #111",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `conic-gradient(
  from 0deg, 
  #ff3c78, 
#c71832,
  #ff3c78, 
#c71832, 
  #ff3c78
)`,
                    }}
                  >
                    AI
                  </span>

                  <span
                    className={`fw-semibold ${sm_break_point ? "d-none" : ""}`}
                  >
                    VIBE INK
                  </span>
                </a>
              </li>

              <li className="nav-item">
                <Nav.Link
                  href={`${openSlidWin ? "" : "/home"}`}
                  className={`nav-link d-flex align-items-center gap-3 fs-6  ${
                    activeIndex == "Home" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveIndex("Home");
                    setopenSlidWin(false);
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", color: text_clrH }}
                  >
                    <FontAwesomeIcon icon={faHome} />
                  </div>
                  <span
                    className={`fw-semibold pe-5 ${
                      sm_break_point ? "d-none" : ""
                    }`}
                    style={{ width: "154px", color: text_clrH }}
                  >
                    Home
                  </span>
                </Nav.Link>
              </li>

              <li className="nav-item ">
                <Nav.Link
                  className={`nav-link d-flex align-items-center gap-3 fs-6 ${
                    activeIndex == "Upload" ? "active" : ""
                  }`}
                  onClick={() => {
                    setopenSlidWin(true);
                    setActiveIndex("Upload");
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", color: text_clrH }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                  <span
                    className={`fw-semibold pe-5 ${
                      sm_break_point ? "d-none" : ""
                    }`}
                    style={{ width: "154px", color: text_clrH }}
                  >
                    Upload
                  </span>
                </Nav.Link>
              </li>

              <li className="nav-item">
                <div
                  className={`d-flex p-0 nav-link align-items-center ${
                    activeIndex == "Notifications" ? "active" : "br"
                  }`}
                  onClick={() => {
                    setCount(0);
                    setopenSlidWin(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <NotificationBell />
                  <span
                    className={`fw-semibold pe-5 ${
                      sm_break_point ? "d-none" : ""
                    }`}
                    style={{ width: "154px", color: text_clrH }}
                  >
                    Notifications
                  </span>
                </div>
              </li>

              {loggedIn && admin_user?._id ? (
                <>
                  <li className="nav-item pb-2">
                    <Nav.Link
                      href={`/api/user/${admin_user?._id}`}
                      className={`nav-link d-flex align-items-center gap-3 fs-6 ${
                        activeIndex == "User" ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveIndex("User");
                      }}
                    >
                      <span
                        className={`d-flex align-items-center justify-content-center border rounded-1 text-danger`}
                        style={{
                          width: "24px",
                          height: "24px",
                        }}
                      >
                        <FontAwesomeIcon icon={faUser} />
                      </span>

                      <span
                        className={`fw-semibold ${
                          sm_break_point ? "d-none" : ""
                        }`}
                        style={{ color: text_clrH }}
                      >
                        User Profile
                      </span>
                    </Nav.Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Nav.Link
                      href="/signup"
                      className={`nav-link text-dark d-flex align-items-center gap-3 fs-6 ${
                        activeIndex == "User" ? "active" : ""
                      }
                  `}
                      onClick={() => {
                        setopenSlidWin(false);
                        setActiveIndex("User");
                      }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center gap-3"
                        style={{ width: "24px", height: "24px" }}
                      >
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <span
                        className={`fw-semibold pe-5 small ${
                          sm_break_point ? "d-none" : ""
                        }`}
                      >
                        {" "}
                        Create an Account
                      </span>
                    </Nav.Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}

        {activeIndex === "Upload" && (
          <div
            className="overflow-y-auto h-100 position-relative none-scroller"
            style={{ zIndex: 8999922, margin: "auto" }}
          >
            <CanvasVibeEditor />
          </div>
        )}
      </div>

      {activeIndex === "Notifications" && (
        <div
          className="h-100 position-fixed w-100"
          style={{
            zIndex: 8992,
            margin: "auto",
            top: `${mobile_break_point ? "52px" : "54px"}`,
            left: `${
              mobile_break_point ? "0" : sm_break_point ? "40px" : "26px"
            }`,
          }}
        >
          <Notification setVisibleNotification={setVisibleNotification} />
        </div>
      )}
    </>
  );
}
