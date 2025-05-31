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

function MainHeader() {
  const currentUser = "68367db96029e4bffe215341";

  const [VisibleNotification, setVisibleNotification] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    if (onLogout) onLogout();
  };

  // if (loggedIn) {
  //   return (
  //
  //   );
  // }

  return (
    <>
      {["md"].map((expand) => (
        <Navbar
          key={expand}
          expand={expand}
          className="mb-3 ps-2"
          bg="light"
          variant="light"
          fixed="top"
          style={{ borderBottom: "1px solid var(--light-clr)" }}
        >
          <Container fluid>
            <Navbar.Brand href="/Explore" className="fw-bold fs-5">
              {" "}
              Digital Market
            </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  AI Market
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="bg-light text-white">
                <Nav className="justify-content-end flex-grow-1 pe-2 gap-2 align-items-center">
                  <Nav.Link href="/home">Home</Nav.Link>
                  <Nav.Link href="/upload">Upload</Nav.Link>
                  <Nav.Link href="/Explore">Explore</Nav.Link>
                  <Nav.Link href="/shop">Shop Now</Nav.Link>

                  <Nav.Link
                    href=""
                    onClick={() => {
                      setVisibleNotification(!VisibleNotification);
                    }}
                  >
                    <FontAwesomeIcon icon={faBell} />
                  </Nav.Link>

                  {loggedIn ? (
                    <>
                      <button
                        className="btn btn-danger text-white p-1 ps-2 pe-2 rounded-0"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                      <Nav.Link
                        href={`/user/${currentUser}`}
                        className="text-white text-center rounded-circle bg-danger"
                        style={{ width: "42px" }}
                      >
                        <FontAwesomeIcon icon={faUser} />
                      </Nav.Link>
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
        <div
          className="notification shadow-lg d-flex flex-column gap-3  p-2 bg-light position-fixed bg-black"
          style={{
            maxHeight: "80vh",
            width: "280px",
            zIndex: "100",
            right: "0px",
            top: "56px",
            borderLeft: "1px solid var(--lightBlack-clr)",
          }}
        >
          <div className="followersNotify p-2">
            <div className="d-flex gap-2">
              <div
                className="dpPhoto rounded-circle bg-primary"
                style={{ minWidth: "37px", height: "37px" }}
              >
                {/* <img src="" alt="" /> */}
              </div>
              <span className="small">
                <span className="small d-block fw-light">16 min ago</span>
                <span className="">Mahtab Shah followed you . .</span>
              </span>
            </div>
          </div>

          <div className="commentNotify p-2">
            <div className="d-flex gap-2">
              <div
                className="dpPhoto bg-danger rounded-circle"
                style={{ minWidth: "37px", height: "37px" }}
              >
                {/* <img src="" alt="" /> */}
              </div>
              <span className="small">
                <span className="small d-block fw-light">41 min ago</span>
                <span className="fw-medium d-block">@ someone commented </span>
                <span className="justify">
                  {" "}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Commodi, . . .
                </span>
              </span>
            </div>
          </div>

          <div className="likeNootify p-2">
            <div className="d-flex gap-2">
              <div
                className="dpPhoto rounded-circle bg-success"
                style={{ minWidth: "37px", height: "37px" }}
              >
                {/* <img src="" alt="" /> */}
              </div>
              <span className="small">
                <span className="small d-block fw-light">1 hour ago</span>
                <span className="fw-medium d-block">
                  @ someone liked your post{" "}
                </span>
                <span className="justify">You have reached 991 likes</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MainHeader;
