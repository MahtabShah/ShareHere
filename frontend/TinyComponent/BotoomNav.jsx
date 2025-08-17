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
  const {
    admin_user,
    sm_break_point,
    setopenSlidWin,
    setActiveIndex,
    activeIndex,
    openSlidWin,
  } = useQuote();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const { text_clrH, text_clrL, text_clrM, bg1 } = useTheme();
  return (
    <>
      {sm_break_point && (
        <>
          <div
            className="BottomNav py-1 w-100 d-sm-none position-fixed"
            style={{
              zIndex: 90019999999991,
              height: "48px",
              bottom: "0",
              left: "0",
              background: bg1,
              boxShadow: `0 -2px 12px ${bg1}`,
            }}
          >
            <ul className="nav nav-pills gap-3 mb-auto d-flex justify-content-around">
              <li className="nav-item ">
                <Nav.Link
                  className={`nav-link text-dark d-flex ms-1 align-items-center gap-3 fs-6 ${
                    activeIndex == "Home" ? "active" : "br"
                  }`}
                  href={`${openSlidWin ? "" : "/Home"}`}
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
                    style={{ width: "154px" }}
                  >
                    Home
                  </span>
                </Nav.Link>
              </li>

              <li className="nav-item ">
                <Nav.Link
                  className={`nav-link text-dark d-flex align-items-center gap-3 fs-6 ${
                    activeIndex == "Upload" ? "active" : "br"
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
                    style={{ width: "154px" }}
                  >
                    Upload
                  </span>
                </Nav.Link>
              </li>

              <li className="nav-item ">
                <div
                  className={`nav-link p-0 ${
                    activeIndex == "Notifications" ? "active" : "br"
                  }`}
                >
                  <NotificationBell />
                </div>
              </li>

              {loggedIn && admin_user?._id ? (
                <>
                  <li className="nav-item border-bottom pb-2">
                    <a
                      href={`/api/user/${admin_user?._id}`}
                      className={`nav-link d-flex align-items-center gap-3 fs-6 ${
                        activeIndex == "User" ? "active" : "br"
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
                  <Nav.Link href="/signup">
                    <FontAwesomeIcon icon={faUser} />
                  </Nav.Link>
                </>
              )}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
