import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Nav from "react-bootstrap/Nav";

import {
  faEdit,
  faExternalLinkAlt,
  faLock,
  faStar,
  faUser,
  faSpinner,
  faGear,
  faUsers,
  faHome,
  faBell,
  faBookOpen,
  faCircleInfo,
  faCircleQuestion,
  faSearch,
  faBars,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, createContext, useState, useContext } from "react";
import { Logo } from "../../TinyComponent/Logo";
export const btnclass = "btn btn-sm progressBtn text-white ps-4 pe-4 rounded-5";
import { useQuote } from "../context/QueotrContext";
import axios from "axios";
import { SearchBaar } from "../../TinyComponent/SearchBaar";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../TinyComponent/Notification";
import PostSentence from "./PostSentance";
const API = import.meta.env.VITE_API_URL;
const inputtxtclr = "#777";

const menuItems = [
  { icon: faExternalLinkAlt, label: "Connect", herf: "Home" },
  { icon: faLock, label: "Privacy", herf: "Home" },
  { icon: faBookOpen, label: `FAQ's`, herf: "Home" },
  { icon: faCircleInfo, label: "About", herf: "Home" },
  { icon: faCircleQuestion, label: "Help", herf: "Home" },
  { icon: faGear, label: "Settings", herf: "Home" },
  { icon: faUser, label: "User Profile", herf: "profile" },
];

export default function LeftNavbar({ onActiveChange = "" }) {
  const {
    sm_break_point,
    admin_user,
    curr_all_notifications,
    setUploadClicked,
    uploadClicked,
    mobile_break_point,
    openSlidWin,
    setopenSlidWin,
    activeIndex,
    setActiveIndex,
    setVisibleNotification,
    VisibleNotification,
  } = useQuote();

  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (curr_all_notifications && curr_all_notifications?.length > 0) {
      const length =
        curr_all_notifications?.filter((n) => n?.isRead === false)?.length || 0;
      setCount(length);
    }
  }, [curr_all_notifications, VisibleNotification]);

  const Mark_as_read_notification = async () => {
    try {
      const res = await axios.put(
        `${API}/api/crud/crud_mark_notification`,
        { curr_all_notifications }, // ✅ This is the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setLoading(false);
      // console.log("marked---->", res.data);
      // setcurr_all_notifications(res.data);
    } catch (error) {
      console.log("error in notification", error);
    }
  };

  function GiveComponent(activeIndex) {
    if (activeIndex == "Search") {
      return <SearchBaar />;
    } else if (activeIndex == "Notifications") {
      return <Notification setVisibleNotification={setVisibleNotification} />;
    } else if (activeIndex == "Upload") {
      return <PostSentence />;
    }
  }

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

  return (
    <>
      <div
        className="LeftNavbar d-flex position-fixed bg-light"
        style={{
          zIndex: 11,
          borderRight: "1px solid var(--light-clr)",
          translate: `${mobile_break_point ? "-80px" : "0"}`,
        }}
      >
        <div
          className="d-flex p-2"
          style={{ height: "100vh", borderTopRightRadius: "20px" }}
        >
          {/* <div className="mb-2 fw-bold text-uppercase fs-5">Menu</div> */}
          <ul className="nav nav-pills flex-column gap-3 mb-auto">
            <li className="nav-item border-bottom pb-2">
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

            <li className="nav-item ">
              <Nav.Link
                className={`nav-link text-dark d-flex align-items-center gap-3 fs-6 `}
                href="/Home"
                onClick={() => {
                  setActiveIndex("Home");
                  setopenSlidWin(false);
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: "24px", height: "24px" }}
                >
                  <FontAwesomeIcon icon={faHome} />
                </div>
                <span
                  className={`fw-semibold pe-5 ${
                    sm_break_point ? "d-none" : ""
                  }`}
                  style={{ width: "154px" }}
                >
                  Home
                </span>
              </Nav.Link>
            </li>

            <li className="nav-item ">
              <Nav.Link
                className={`nav-link text-dark d-flex align-items-center gap-3 fs-6 `}
                onClick={() => {
                  setUploadClicked(!uploadClicked);
                  setActiveIndex("Upload");
                  setopenSlidWin(true);
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: "24px", height: "24px" }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <span
                  className={`fw-semibold pe-5 ${
                    sm_break_point ? "d-none" : ""
                  }`}
                  style={{ width: "154px" }}
                >
                  Upload
                </span>
              </Nav.Link>
            </li>

            <li className="nav-item ">
              <Nav.Link
                className={`nav-link text-dark d-flex align-items-center gap-3 fs-6 `}
                onClick={() => {
                  setVisibleNotification(!VisibleNotification);
                  setCount(0);
                  Mark_as_read_notification();
                  setActiveIndex("Notifications");
                  setopenSlidWin(true);
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: "24px", height: "24px" }}
                >
                  <FontAwesomeIcon icon={faBell} />
                </div>
                <span
                  className={`fw-semibold pe-5 ${
                    sm_break_point ? "d-none" : ""
                  }`}
                  style={{ width: "154px" }}
                >
                  Notifications
                </span>
              </Nav.Link>
            </li>

            <li className="nav-item ">
              <Nav.Link
                className={`nav-link text-dark d-flex align-items-center gap-3 fs-6 `}
                onClick={() => {
                  setopenSlidWin(true);
                  setActiveIndex("Search");
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: "24px", height: "24px" }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <span
                  className={`fw-semibold pe-5 ${
                    sm_break_point ? "d-none" : ""
                  }`}
                  style={{ width: "154px" }}
                >
                  Search
                </span>
              </Nav.Link>
            </li>

            {loggedIn && admin_user?._id ? (
              <>
                <li className="nav-item border-bottom pb-2">
                  <a
                    href={`/api/user/${admin_user?._id}`}
                    className={`nav-link d-flex align-items-center gap-3 fs-6`}
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
                      className={`fw-semibold text-dark ${
                        sm_break_point ? "d-none" : ""
                      }`}
                    >
                      User Profile
                    </span>
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Nav.Link
                    href="/signup"
                    className={`nav-link text-dark d-flex align-items-center gap-3 fs-6 `}
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
        {openSlidWin && (
          <div
            className="border p-2"
            style={{
              zIndex: 222000000,
              width: `clamp(100px, calc(100vw - ${
                mobile_break_point ? "0px" : sm_break_point ? "84px" : "280px"
              }), 700px)`,

              marginTop: `${mobile_break_point ? "54px" : ""}`,
            }}
          >
            <div className="d-flex gap-2 align-items-center pt-2 p-1">
              <div
                className="d-flex"
                style={{ width: "16px", cursor: "pointer" }}
                onClick={() => {
                  setopenSlidWin(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
              </div>
              <p className="fs-5 fw-semibold p-0 m-0 align-items-center">
                {activeIndex} Here
              </p>
            </div>
            {GiveComponent(activeIndex)}
          </div>
        )}
      </div>
    </>
  );
}
