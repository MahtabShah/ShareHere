import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, createContext, useState, useContext } from "react";
export const btnclass = "btn btn-sm progressBtn text-white ps-4 pe-4 rounded-5";

export default function LeftNavbar({
  onActiveChange = "",
  isDisplayedLeftNav = false,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  // const { inputbgclr, inputtxtclr, NavbarClr ,handleThemeChange } = useTheme();
  const [NavtransformX, setNavtransformX] = useState(true);
  const inputtxtclr = "#777";

  const menuItems = [
    { icon: faHome, label: "Home" },
    { icon: faSpinner, label: "Progress" },
    { icon: faSearch, label: "Search" },
    { icon: faUsers, label: "Friends" },
    { icon: faExternalLinkAlt, label: "Connect" },
    { icon: faLock, label: "Privacy" },
    { icon: faBookOpen, label: `FAQ's` },
    { icon: faCircleInfo, label: "About" },
    { icon: faCircleQuestion, label: "Help" },
    { icon: faGear, label: "Settings" },
    { icon: faUser, label: "User Profile" },
  ];

  const handleItemClick = (index) => {
    setActiveIndex(index);
    onActiveChange(menuItems[index].label);
    setNavtransformX(!NavtransformX);
  };

  return (
    <>
      {!isDisplayedLeftNav ? (
        <>
          {/* <div className="threeBars pt-0 ps-4 pt-5 mt-5 h-100">
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => setNavtransformX(!NavtransformX)}
            />
          </div> */}

          <div
            className="LeftNavbar pt-4 position-fixed bg-light"
            style={{
              zIndex: "11",
              borderRight: "1px solid var(--light-clr)",
              width: "200px",
            }}
          >
            <div
              className="d-flex flex-column ps-3"
              style={{ height: "100vh", borderTopRightRadius: "20px" }}
            >
              {/* <div className="mb-2 fw-bold text-uppercase fs-5">Menu</div> */}
              <ul className="nav nav-pills flex-column gap-3 mb-auto pe-5 pt-4">
                {menuItems.map((item, idx) => (
                  <li key={idx} className="nav-item">
                    <a
                      href="#"
                      className={`nav-link d-flex align-items-center gap-3 fs-6 ${
                        idx === activeIndex ? "bg-purple text-black" : ""
                      }`}
                      style={{
                        borderRadius: "4px",
                        padding: "7px",
                        color: `${inputtxtclr}`,
                      }}
                      onClick={() => handleItemClick(idx)}
                    >
                      <FontAwesomeIcon icon={item.icon} />
                      <span className="fw-semibold">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
              {/* <div className="mt-auto pt-4">
            <a
              href="mailto:info@coachifylive.com"
              className="d-flex align-items-center gap-2 text-dark fw-semibold"
            >
              <FontAwesomeIcon icon={faHeadset} />
             AI Market
            </a>
          </div> */}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
