import { useQuote } from "../src/context/QueotrContext";

export const Logo = () => {
  const { sm_break_point } = useQuote();
  return (
    <>
      <div
        className={`position-relative d-flex pb-0 mb-0 align-items-center justify-content-center ${
          sm_break_point ? "" : "mt-2"
        }`}
        style={{ minWidth: "fit-content" }}
      >
        {!sm_break_point && (
          <span
            className="position-relative d-inline-flex pt-2 justify-content-center fs-4"
            style={{
              borderTop: "2px solid #111",
              minWidth: "110px",
              lineHeight: 1,
            }}
          >
            VIBE INK
          </span>
        )}
        <div
          className="small d-flex align-items-start gap-2 position-absolute"
          style={{ fontSize: "10px", top: "-16px" }}
        >
          {!sm_break_point && (
            <span style={{ lineHeight: "1.6" }}>Allways</span>
          )}

          <a
            href="/home"
            className={`d-inline-flex text-light ${
              sm_break_point ? "ms-3" : ""
            }`}
            style={{
              minWidth: "24px",
              height: "24px",
              borderRadius: "50%",
              borderEndEndRadius: 0,
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
          </a>
          {!sm_break_point && (
            <span style={{ lineHeight: "1.6" }}>Inspire</span>
          )}
        </div>
      </div>
    </>
  );
};
