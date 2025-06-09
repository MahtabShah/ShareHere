// -------------- Done ------------------------------

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSpinner,
  faHome,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useQuote } from "../src/context/QueotrContext";
export const btnclass = "btn btn-sm progressBtn text-white ps-4 pe-4 rounded-5";

export default function BottomNav({}) {
  const { admin_user, isDisplayedLeftNav } = useQuote();
  const [activeIndex, setActiveIndex] = useState(0);
  const [NavtransformX, setNavtransformX] = useState(true);
  const inputtxtclr = "#777";

  const menuItems = [
    { icon: faHome, label: "Home", herf: "/home" },
    // { icon: faSpinner, label: "Progress", herf: "/home" },
    // { icon: faSearch, label: "Search", herf: "/home" },
    { icon: faUser, label: "Friends", herf: `api/user/${admin_user?._id}` },
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
          <div
            className="BottomNav w-100 d-sm-none bg-light position-fixed"
            style={{
              zIndex: "11",
              borderRight: "1px solid var(--light-clr)",
              height: "48px",
              bottom: "0",
              left: "0",
            }}
          >
            <ul className="nav nav-pills d-flex align-items-center w-100 border justify-content-between pe-2 ps-2 h-100 ">
              {menuItems.map((item, idx) => (
                <li key={`menuitems${idx}`} className="nav-item flex--1">
                  <a
                    href={item.herf}
                    className={`nav-link d-flex align-items-center gap-3 fs-6 ${
                      idx === activeIndex ? "text-black" : ""
                    }`}
                    style={{
                      borderRadius: "4px",
                      padding: "7px",
                      color: `${inputtxtclr}`,
                    }}
                    onClick={() => handleItemClick(idx)}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
