import { Home, CardPost } from "./maincomponents/Home";
import { useState, useRef } from "react";
import { useQuote } from "./context/QueotrContext";

import React, { useEffect } from "react";

function rgbToHex(rgbString) {
  const match = rgbString.match(
    /^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i
  );
  if (!match) return null;

  const [r, g, b] = match.slice(1).map(Number);

  const toHex = (val) => {
    const hex = val.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const ProgressBar = ({ duration }) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const { isPaused, setStatusClicked } = useQuote();
  useEffect(() => {
    const time = duration; // 10 sec second
    const steps = 100;
    const interval = time / steps; // 10ms per step

    if (isPaused || progress >= 100) {
      progress >= 100 ? setStatusClicked(null) : "";
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      // return setProgress(0);
    } else {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setStatusClicked(null);
            clearInterval(intervalRef.current);

            return 100;
          }
          return prev + 1;
        });
      }, interval);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPaused, progress]);

  // const timer = setInterval(() => {
  //   setProgress((prev) => {
  //     if (prev >= 100) {
  //       clearInterval(timer);
  //       return 100;
  //     }
  //     return prev + 1;
  //   });
  // }, interval);

  // return () => clearInterval(timer);
  // }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "4px",
        background: "#ddd",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: "linear-gradient(to right, #4facfe, #00f2fe)",
          borderRadius: "0",
          transition: "width 0.01s linear",
        }}
      ></div>
    </div>
  );
};

export const StatusRing = ({ post }) => {
  const { setStatusClicked, statusClicked, duration } = useQuote();
  return (
    <>
      <div className="status-item d-flex align-items-center justify-content-center">
        <div className="status-ring d-flex align-items-center justify-content-center">
          <div
            className="status-image bg-light overflow-hidden"
            onClick={() => {
              setStatusClicked(post);
            }}
          >
            {post?.pages?.map((pg, idx) => {
              return (
                <>
                  <CardPost pg={pg} />
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

// const PauseTrigger = ({}) => {
//   const { setStatusClicked, statusClicked, duration, isPaused, setIsPaused } =
//     useQuote();

//   return (
//     <div
//       onMouseEnter={() => setIsPaused(true)}
//       onMouseLeave={() => setIsPaused(false)}
//       onTouchStart={() => setIsPaused(true)}
//       onTouchEnd={() => setIsPaused(false)}
//       style={{
//         width: "200px",
//         height: "60px",
//         background: "#ffcccc",
//         borderRadius: "10px",
//         textAlign: "center",
//         lineHeight: "60px",
//         fontWeight: "bold",
//         userSelect: "none",
//       }}
//     >
//       Hover or Touch Here to Pause
//     </div>
//   );
// };

export const StatusPage = ({}) => {
  const { setStatusClicked, statusClicked, duration, isPaused, setIsPaused } =
    useQuote();
  console.log("setclicked", "statusClicked?.pages[0].val");
  return (
    <>
      {statusClicked && (
        <div className="">
          <ProgressBar duration={duration} />
          <div className="d-flex align-items-center mt-2 mb-3 gap-2">
            <StatusRing post={statusClicked} />

            <div className="d-flex justify-content-between borde w-100 gap-3 pe-1">
              <div
                className="d-flex flex-grow-1 flex-column"
                style={{ minWidth: "max-content" }}
              >
                <span>Mahtab</span>
                <small>Today, 8:20</small>
              </div>

              <small
                className="fw-bold"
                style={{ transform: "rotateZ(90deg)" }}
              >
                +++
              </small>
            </div>
          </div>
          <div
            className="flex-grow-1 h-100"
            onClick={() => {
              setStatusClicked(null);
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {statusClicked?.pages?.map((pg, idx) => {
              return (
                <>
                  <CardPost pg={pg} />
                </>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
