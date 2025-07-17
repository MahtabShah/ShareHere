// -------------- Done ------------------------------

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useQuote } from "../src/context/QueotrContext";
export const btnclass = "btn btn-sm progressBtn text-white ps-4 pe-4 rounded-5";
import Nav from "react-bootstrap/Nav";
import { SearchBaar } from "./SearchBaar";
import { Notification } from "./Notification";
import PostSentence from "../src/maincomponents/PostSentance";
import {
  faUser,
  faHome,
  faBell,
  faSearch,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function BottomNav({}) {
  const {
    admin_user,
    sm_break_point,
    mobile_break_point,
    setopenSlidWin,
    setActiveIndex,
    activeIndex,
    setUploadClicked,
    uploadClicked,
    openSlidWin,
    setVisibleNotification,
    VisibleNotification,
  } = useQuote();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  return (
    <>
      {mobile_break_point && (
        <>
          <div
            className="BottomNav w-100 d-sm-none bg-light position-fixed"
            style={{
              zIndex: "11",
              height: "48px",
              bottom: "0",
              left: "0",
            }}
          >
            <ul className="nav nav-pills gap-3 mb-auto d-flex justify-content-around">
              <li className="nav-item ">
                <Nav.Link
                  className={`nav-link text-dark d-flex align-items-center gap-3 fs-6 `}
                  href={`${openSlidWin ? "" : "/Home"}`}
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
