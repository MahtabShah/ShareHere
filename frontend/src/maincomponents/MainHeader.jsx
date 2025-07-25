import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
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

  const { text_clrH, text_clrL, text_clrM, mainbg } = useTheme();

  return (
    <>
      {["sm"].map((expand) => (
        <Navbar
          key={`expand${expand}`}
          expand={expand}
          className="mb-0 ps-2"
          // bg="light"
          variant="light"
          fixed="top"
          style={{
            // borderBottom: "1px solid var(--light-clr)",
            background: mainbg,
            zIndex: 10000,
          }}
        >
          <Container fluid>
            {mobile_break_point && (
              <div
                href="/Explore"
                className="fw-bold fs-6 pb-0 mb-0 flex-grow-1"
              >
                <div className="d-flex justify-content-between w-100 flex-grow-1">
                  <div className="mt-2 ms-1 d-flex align-items-center">
                    <Logo />
                  </div>

                  <div className="d-flex align-items-center gap-3">
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

                    <li className="nav-item " style={{ listStyle: "none" }}>
                      <Nav.Link
                        className={`nav-link text-dark d-flex align-items-center gap-3 fs-6 `}
                        onClick={() => {
                          setUploadClicked(!uploadClicked);
                          setActiveIndex("Upload");
                          setopenSlidWin(!openSlidWin);
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            background: text_clrL,
                            padding: "4px 6px 6px",
                            color: text_clrH,
                          }}
                        >
                          create
                        </div>
                      </Nav.Link>
                    </li>
                  </div>
                </div>
              </div>
            )}

            {/* <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  AI [Allways Inspire] VIBE INK
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="bg-light text-dark">
                <Nav className="justify-content-end flex-grow-1 pe-2 gap-2 align-items-">
                  <Nav.Link href="/home">Home</Nav.Link>
                  <Nav.Link
                    onClick={() => {
                      setUploadClicked(!uploadClicked);
                    }}
                  >
                    Upload
                  </Nav.Link>
                  <Nav.Link href="/Explore">Explore</Nav.Link>
                  {smbreakPoint && (
                    <Nav.Link href={`/api/user/${admin_user?._id}`}>
                      Profile
                    </Nav.Link>
                  )}
                  {!smbreakPoint && (
                    <>
                      <Nav.Link
                        href=""
                        onClick={() => {
                          setVisibleNotification(!VisibleNotification);
                          setCount(0);
                          Mark_as_read_notification();
                        }}
                      >
                        <FontAwesomeIcon icon={faBell} />
                        <NotificationBell count={count} />
                      </Nav.Link>
                    </>
                  )}

                  {loggedIn && admin_user?._id ? (
                    <>
                      <div className="d-flex align-items-center ">
                        {smbreakPoint && (
                          <button
                            className="btn btn-danger text-white p-1 ps-2 pe-5 rounded-0 flex-grow-1 position-relative"
                            onClick={handleLogout}
                            style={{ minWidth: "134px", height: "34px" }}
                          >
                            Logout
                          </button>
                        )}
                        <Nav.Link
                          href={`/api/user/${admin_user?._id}`}
                          className="text-white text-center position-absolut rounded-circle bg-danger d-flex align-items-center justify-content-center "
                          style={{
                            width: "34px",
                            height: "34px",
                            zIndex: "2",
                            right: "10px",
                            boxShadow: "0 0 0 6px #f8f9fa",
                          }}
                        >
                          <FontAwesomeIcon icon={faUser} />
                        </Nav.Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <Nav.Link href="/signup">
                        <span className="btn btn-outline-primary p-1 ps-2 pe-2 rounded-0">
                          Signup
                        </span>
                      </Nav.Link>
                      <Nav.Link href="/login">
                        <span className="btn btn-outline-danger p-1 ps-2 pe-2 rounded-0">
                          Login
                        </span>
                      </Nav.Link>
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas> */}
          </Container>
        </Navbar>
      ))}
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
