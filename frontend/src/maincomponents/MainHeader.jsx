import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../TinyComponent/Logo";
import { Notification } from "../../TinyComponent/Notification";
import { useQuote } from "../context/QueotrContext";
import axios from "axios";
import { SearchBaar } from "../../TinyComponent/SearchBaar";
const API = import.meta.env.VITE_API_URL;
import { useTheme } from "../context/Theme";

function MainHeader({}) {
  const [VisibleNotification, setVisibleNotification] = useState(false);
  const [smbreakPoint, setsmbreakPoint] = useState(window.innerWidth < 600);
  const [loggedIn, setLoggedIn] = useState(false);
  const {
    admin_user,
    curr_all_notifications,
    setUploadClicked,
    uploadClicked,
    mobile_break_point,
    openSlidWin,
    setopenSlidWin,
    sm_break_point,
    setActiveIndex,
  } = useQuote();

  const [count, setCount] = useState(0);
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
    if (curr_all_notifications && curr_all_notifications?.length > 0) {
      const length =
        curr_all_notifications?.filter((n) => n?.isRead === false)?.length || 0;
      setCount(length);
    }
  }, [curr_all_notifications]);

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

  useEffect(() => {
    window.addEventListener("resize", () => {
      setsmbreakPoint(window.innerWidth < 600);
    });
  }, [smbreakPoint]);

  const { text_clrH, text_clrL, text_clrM, mainbg, bg1, setThemeType } =
    useTheme();
  const [fading, setFading] = useState(false);
  const theme = localStorage.getItem("theme");

  const toggleTheme = () => {
    setFading(true); // start fade out

    setTimeout(() => {
      setFading(false); // fade back in
    }, 400);

    setTimeout(() => {
      setThemeType(theme === "dark" ? "light" : "dark");
      // document.body.classList.toggle(theme);
    }, 440);
  };

  return (
    <>
      <Navbar
        className="py-2"
        variant="light"
        fixed="top"
        style={{
          background: bg1,
          zIndex: 990999,
          marginLeft: `${
            mobile_break_point ? "0px" : sm_break_point ? "74px" : "244px"
          }`,
        }}
      >
        <Container fluid>
          <div className="fw-bold fs-6 p-0 m-0 flex-grow-1">
            <div className="d-flex align-items-center gap-2 w-100 flex-grow-1">
              {smbreakPoint && (
                <div className="d-flex justify-content-center align-items-center">
                  <Logo />
                </div>
              )}
              <div className="w-100">
                <SearchBaar />
              </div>

              {!sm_break_point && (
                <li className="nav-item " style={{ listStyle: "none" }}>
                  <Nav.Link
                    className={`nav-link text-dark d-flex align-items-center gap-3 fs-6 `}
                    onClick={() => {
                      if (count <= 0) {
                        setVisibleNotification(!VisibleNotification);
                        Mark_as_read_notification();
                      }
                      setActiveIndex("Notifications");
                      setopenSlidWin(true);
                      setopenSlidWin(!openSlidWin);

                      setCount(0);
                    }}
                  >
                    <div
                      className="d-flex align-items-center small justify-content-center"
                      style={{ width: "24px", height: "24px" }}
                    >
                      {count > 0 && (
                        <small
                          className="text-light small position-absolute text-center rounded-4 fw-bold "
                          style={{
                            translate: "10px -4px",
                            minWidth: "18px",
                            height: "18px",
                            background: "red",
                          }}
                        >
                          {count > 0 ? count : ""}
                        </small>
                      )}

                      <FontAwesomeIcon
                        icon={faBell}
                        color={text_clrH}
                        fontSize={20}
                      />
                    </div>
                  </Nav.Link>
                </li>
              )}

              <button
                className={`rotate`}
                onClick={toggleTheme}
                style={{
                  background: "transparent",
                  border: "none",
                  color: text_clrH,
                  minWidth: "24px",
                  fontSize: 20,
                }}
              >
                <FontAwesomeIcon
                  icon={theme == "dark" ? faSun : faMoon}
                  className={`theme-icon ${fading ? "fade-out" : ""}`}
                  style={{ fontSize: "20px" }}
                />
              </button>
            </div>
          </div>
        </Container>
      </Navbar>
    </>
  );
}

const NotificationBell = ({ count }) => {
  return (
    <div className="position-relative d-inline-block">
      {count > 0 && (
        <span
          className="position-absolute start-50 translate-middle bg-danger border border-light text-light d-flex align-items-center justify-content-center rounded-circle fw-bold"
          style={{
            fontSize: "0.5rem",
            width: "20px",
            height: "20px",
            left: "5px",
          }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  );
};

export default MainHeader;
// this is commit
