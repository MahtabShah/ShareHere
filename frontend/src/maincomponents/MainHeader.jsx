import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../TinyComponent/Logo";
import { Notification } from "../../TinyComponent/Notification";
import { useQuote } from "../context/QueotrContext";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

function MainHeader({ curr_all_notifications, admin }) {
  const [VisibleNotification, setVisibleNotification] = useState(false);
  const [smbreakPoint, setsmbreakPoint] = useState(window.innerWidth < 576);
  const [loggedIn, setLoggedIn] = useState(false);
  const [count, setCount] = useState(
    curr_all_notifications?.filter((n) => n.isRead === false).length || 0
  );
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
    setCount(
      curr_all_notifications.filter((n) => n.isRead === false).length || 0
    );
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
      console.log("marked---->", res.data);
      // setcurr_all_notifications(res.data);
    } catch (error) {
      console.log("error in notification", error);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      setsmbreakPoint(window.innerWidth < 576);
    });
  }, [smbreakPoint]);

  return (
    <>
      {["sm"].map((expand) => (
        <Navbar
          key={expand}
          expand={expand}
          className="mb-0 ps-2"
          bg="light"
          variant="light"
          fixed="top"
          style={{ borderBottom: "1px solid var(--light-clr)" }}
        >
          <Container fluid>
            <Navbar.Brand
              href="/Explore"
              className="fw-bold fs-6 pb-0 mb-0 flex-grow-1"
            >
              <div className="d-flex justify-content-between w-100 flex-grow-1">
                <div className="mt-2">
                  <Logo />
                </div>
                {smbreakPoint && (
                  <div className="d-flex gap-2">
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
                    <Nav.Link href="/upload">
                      <small
                        className="fw-normal rounded-5 border"
                        style={{
                          background: "#1111",
                          padding: "4px 6px 6px",
                        }}
                      >
                        {" "}
                        create<span className="fw-bold">+</span>
                      </small>
                    </Nav.Link>
                  </div>
                )}
              </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
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
                  <Nav.Link href="/upload">Upload</Nav.Link>
                  {/* <Nav.Link href="/Explore">Explore</Nav.Link> */}
                  <Nav.Link href={`/api/user/${admin?._id}`}>Profile</Nav.Link>
                  {!smbreakPoint && (
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
                  )}
                  {/* <Nav.Link href="/shop">Shop Now</Nav.Link> */}

                  {loggedIn ? (
                    <>
                      <div className="d-flex">
                        <button
                          className="btn btn-danger text-white p-1 ps-2 pe-5 rounded-0 flex-grow-1 position-relative"
                          onClick={handleLogout}
                          style={{ minWidth: "134px", height: "42px" }}
                        >
                          Logout
                        </button>
                        <Nav.Link
                          href={`/api/user/${admin?._id}`}
                          className="text-white text-center position-absolute rounded-circle bg-danger "
                          style={{
                            width: "42px",
                            zIndex: "2",
                            right: "10px",
                            boxShadow: "0 0 0 10px #f8f9fa",
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

                  {/* ( <div className="d-flex gap-2">
                  //     {" "}
                  //     <button
                  //       className="btn btn-secondary"
                  //       onClick={() => alert("Go to profile")}
                  //     >
                  //       Profile
                  //     </button>
                  //     <button className="btn btn-danger" onClick={handleLogout}>
                  //       Logout
                  //     </button>
                  //   </div>
                  // )} /*}                  

                  {/* <NavDropdown
                    title="Dropdown"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                  >
                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Something else here
                    </NavDropdown.Item>
                  </NavDropdown> */}
                </Nav>
                {/* <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2 bg-dark text-white rounded-5"
                    aria-label="Search"
                  />
                  <Button variant="outline-success rounded-5">Search</Button>
                </Form> */}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}

      {VisibleNotification && (
        <Notification
          curr_all_notifications={curr_all_notifications}
          setVisibleNotification={setVisibleNotification}
          admin={admin}
          // Track_post={Track_post}
        />
      )}
    </>
  );
}

export default MainHeader;

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
