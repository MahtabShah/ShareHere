import { FaInfinity } from "react-icons/fa";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { BsQuote } from "react-icons/bs";

export const Logo = () => {
  return (
    <>
      <div
        className="position-relative d-flex pb-0 mb-0 align-items-center justify-content-center"
        style={{ minWidth: "fit-content" }}
      >
        {/* Digital Market */}
        <div className="">
          <span
            className="position-relative d-inline-flex justify-content-center fs-4 pt-1"
            style={{ borderTop: "2px solid #111", minWidth: "110px" }}
          >
            VIBE INK
          </span>
        </div>

        <div
          className="small d-flex align-items-start gap-2 position-absolute"
          style={{ fontSize: "10px", top: "-14px" }}
        >
          <span style={{ lineHeight: "2" }}>Allways</span>
          <span
            className="d-inline-flex text-light"
            style={{
              minWidth: "24px",
              height: "24px",
              borderRadius: "50%",
              boxShadow: "0 0 0 2px #f8f9fa , 0 0 0 4px #111",
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
          <span style={{ lineHeight: "2" }}>Inspire</span>
        </div>
      </div>
    </>
  );
};
