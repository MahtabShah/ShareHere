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

  function GiveComponent(activeIndex, ref) {
    if (activeIndex == "Search") {
      return (
        <>
          <h5
            className="d-flex align-items-center gap-2 mx-2 position-fixed  py-2"
            style={{
              zIndex: 9999999,
              top: 0,
              left: `${
                mobile_break_point ? 0 : sm_break_point ? "74px" : "246px"
              }`,
              right: 0,
              background: mainbg,
            }}
          >
            {ref} Search Your Quote Here
          </h5>
          <div
            className="w-100"
            style={{ maxWidth: "601px", marginTop: "40px" }}
          >
            <SearchBaar />
          </div>
        </>
      );
    } else if (activeIndex == "Notifications") {
      return (
        <>
          {" "}
          <h5
            className="d-flex align-items-center gap-2 mx-2 position-fixed py-2"
            style={{
              zIndex: 9999999,
              top: 0,
              left: `${
                mobile_break_point ? 0 : sm_break_point ? "74px" : "246px"
              }`,
              right: 0,
              background: mainbg,
            }}
          >
            {ref} All Notifications
          </h5>
          <div style={{ marginTop: "40px" }}>
            <Notification setVisibleNotification={setVisibleNotification} />{" "}
          </div>
        </>
      );
    } else if (activeIndex == "Upload") {
      return (
        <>
          <h5
            className="d-flex align-items-center gap-2 mx-2 position-fixed  py-2"
            style={{
              zIndex: 9999999,
              top: 0,
              left: `${
                mobile_break_point ? 0 : sm_break_point ? "74px" : "246px"
              }`,
              right: 0,
              background: mainbg,
            }}
          >
            {ref} Upload Your Thought Here
          </h5>
          <CanvasVibeEditor />
        </>
      );
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

  useEffect(() => {
    if (openSlidWin) {
      document.documentElement.classList.add("no-scroll");
    } else {
      document.documentElement.classList.remove("no-scroll");
    }
  }, [openSlidWin]);

  const { text_clrH, text_clrL, text_clrM, mainbg, bg1 } = useTheme();

  return (
    <>
      <div
        className="LeftNavbar d-flex h-100 pt-0 position-fixed top-0"
        style={{
          zIndex: `${openSlidWin ? 100000000000 : 1000000000}`,
          width: `${openSlidWin ? "100%" : "0"}`,
          background: bg1,
          borderRight: `${mobile_break_point ? "" : `1px solid ${text_clrL}`}`,
        }}
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
            {/* <div className="mb-2 fw-bold text-uppercase fs-5">Menu</div> */}
            <ul className="nav nav-pills flex-column gap-3 mb-auto">
              <li className="nav-item  pt-1">
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
                    setUploadClicked(!uploadClicked);
                    if (activeIndex == "Upload") {
                      setopenSlidWin(!openSlidWin);
                    } else {
                      setopenSlidWin(true);
                    }
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

              <li className="nav-item ">
                <Nav.Link
                  className={`nav-link  d-flex align-items-center gap-3 fs-6  ${
                    activeIndex == "Notifications" ? "active" : ""
                  }`}
                  onClick={() => {
                    setVisibleNotification(!VisibleNotification);
                    setCount(0);
                    Mark_as_read_notification();

                    if (activeIndex == "Notifications") {
                      setopenSlidWin(!openSlidWin);
                    } else {
                      setopenSlidWin(true);
                      setActiveIndex("Notifications");
                    }
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", color: text_clrH }}
                  >
                    <FontAwesomeIcon icon={faBell} />
                  </div>
                  <span
                    className={`fw-semibold pe-5 ${
                      sm_break_point ? "d-none" : ""
                    }`}
                    style={{ width: "154px", color: text_clrH }}
                  >
                    Notifications
                  </span>
                </Nav.Link>
              </li>

              <li className="nav-item ">
                <Nav.Link
                  className={`nav-link d-flex align-items-center gap-3 fs-6 ${
                    activeIndex == "Search" ? "active" : ""
                  }`}
                  onClick={() => {
                    setopenSlidWin(true);
                    if (activeIndex == "Search") {
                      setopenSlidWin(!openSlidWin);
                    } else {
                      setopenSlidWin(true);
                      setActiveIndex("Search");
                    }
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", color: text_clrH }}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                  <span
                    className={`fw-semibold pe-5 ${
                      sm_break_point ? "d-none" : ""
                    }`}
                    style={{ width: "154px", color: text_clrH }}
                  >
                    Search
                  </span>
                </Nav.Link>
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
        {openSlidWin && (
          <div
            className="p-2 w-100 overflow-y-auto position-relative none-scroller"
            style={{
              zIndex: 2000000,
              top: 0,
              color: text_clrM,

              // marginTop: `${mobile_break_point ? "54px" : ""}`,
              // marginBottom: `${mobile_break_point ? "48px" : ""}`,
            }}
          >
            {GiveComponent(
              activeIndex,
              <span
                className="d-inline-flex ms-1"
                style={{ width: "16px", cursor: "pointer" }}
                onClick={() => {
                  setopenSlidWin(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill={text_clrM}
                >
                  <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}
