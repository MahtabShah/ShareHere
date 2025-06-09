// ✅ Parent Component (Where followings are mapped)
import { useState, useEffect, useRef } from "react";
// ✅ StatusPage Component
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import { BiHeart } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Carousel from "react-bootstrap/Carousel";
import { Fragment } from "react";
import { useQuote } from "../context/QueotrContext";
import { useNavigate } from "react-router-dom";
import PostSentence from "./PostSentance";

const ParentStatusComponent = ({ followings, statuses }) => {
  console.log(followings, statuses);

  const { selectedUserId } = useQuote();

  return (
    <div className="d-flex gap-3">
      {followings?.map((userId, idx) => {
        const user_statuses = statuses?.filter((s) => s?.user?._id === userId);

        return (
          user_statuses?.length > 0 && (
            <Fragment key={idx}>
              <StatusRing userId={userId} all_statuses={statuses} />
            </Fragment>
          )
        );
      })}

      {selectedUserId && (
        <div
          className="position-fixed bg-dark"
          style={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: 100000000 }}
        >
          <StatusPage
            userId={selectedUserId}
            all_statuses={statuses}
            // onClose={() => setSelectedUserId(null)}
          />
        </div>
      )}
    </div>
  );
};

// ✅ StatusRing Component

export const StatusRing = ({ userId, all_statuses }) => {
  const [user_statuses, setUser_statuses] = useState([]);
  const { setSelectedUserId, admin_user, fetch_user_statuses } = useQuote();
  const nevigate = useNavigate();

  useEffect(() => {
    const statuses = all_statuses?.filter((s) => s?.user?._id === userId);
    setUser_statuses(statuses);
    fetch_user_statuses();
  }, [all_statuses, userId]);

  return (
    <>
      <div className="status-item d-flex align-items-center justify-content-center">
        <div className="status-ring d-flex align-items-center justify-content-center">
          <div
            className="status-image bg-light overflow-hidden"
            onClick={() => {
              if (user_statuses?.length > 0) setSelectedUserId(userId);
            }}
          >
            <img
              src={user_statuses[0]?.image || admin_user?.cover_pic}
              alt=""
              className="w-100 h-100"
            />
          </div>
          {admin_user?._id === userId && (
            <>
              <div
                className="position-absolute d-flex fw-bold align-items-center justify-content-center fs-5 pb-1 w-100 h-100 text-light bg-dark"
                style={{
                  bottom: "2px",
                  right: "4px",
                  zIndex: "100",
                  maxHeight: "20px",
                  maxWidth: "20px",
                  aspectRatio: "1/1",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => {
                  nevigate("/upload");
                }}
              >
                +
              </div>
            </>
          )}
        </div>
      </div>
      {admin_user?._id === userId && (
        <>
          <div
            className="position-fixed d-none bg-dark"
            style={{
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 100000000,
            }}
          >
            <div
              className="border bg-light w-100 overflow-hidden  d-flex align-items-center flex-column mt-0 pt-0 position-relative border"
              style={{
                height: "100dvh",
                margin: "auto",
                maxWidth: "420px",
                transform: "scale(0.9)",
              }}
            >
              <PostSentence type={"status"} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

const ProgressBar = ({ duration, condition, activeIndex, setActiveIndex }) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!condition) return setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setActiveIndex((prevIdx) => prevIdx + 1);
          return 100;
        }
        return prev + 1;
      });
    }, duration / 100);

    return () => clearInterval(intervalRef.current);
  }, [condition]);

  return (
    <div style={{ width: "100%", height: "4px", background: "#ddd" }}>
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: "linear-gradient(to right, #4facfe, #00f2fe)",
        }}
      ></div>
    </div>
  );
};

export const StatusPage = ({ userId, all_statuses }) => {
  const [user_statuses, setUser_statuses] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const duration = 4000; // 4 seconds per story
  const { setSelectedUserId } = useQuote();

  useEffect(() => {
    const statuses = all_statuses?.filter((s) => s?.user?._id === userId);
    setUser_statuses(statuses);
  }, [userId, all_statuses]);

  useEffect(() => {
    if (activeIndex >= user_statuses.length && user_statuses.length) {
      // alert(activeIndex);
      setSelectedUserId(null);
    }
  }, [activeIndex]);

  return (
    <>
      {user_statuses && (
        <div
          className="border bg-light w-100 overflow-hidden mt-2 mb-2 d-flex align-items-center flex-column  position-relative border"
          style={{
            height: "100dvh",
            margin: "auto",
            maxWidth: "520px",
            transform: "scale(0.9)",
          }}
        >
          <div className="w-100">
            <div className="d-flex gap-1">
              {user_statuses?.map((_, idx) => (
                <ProgressBar
                  key={idx}
                  duration={duration}
                  condition={activeIndex === idx}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              ))}
            </div>
            <div className="d-flex align-items-center m-2 gap-2">
              <FaArrowLeft
                size={24}
                onClick={() => {
                  setSelectedUserId(null);
                }}
                style={{ cursor: "pointer" }}
              />
              <div className="d-flex justify-content-between w-100 gap-3 pe-1">
                <div className="flex-grow-1 d-flex gap-2">
                  <div
                    className=""
                    style={{
                      width: "44px",
                      aspectRatio: "1/1",
                    }}
                  >
                    <img
                      src={user_statuses[0]?.image}
                      alt=""
                      className="w-100"
                      style={{
                        borderRadius: "50%",
                        maxWidth: "44px",
                        aspectRatio: "1/1",
                      }}
                    />
                  </div>
                  <div>
                    <span>Mahtab</span>
                    <br />
                    <small>Today, 8:20</small>
                  </div>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  {isLiked ? (
                    <FaHeart color="red" onClick={() => setIsLiked(false)} />
                  ) : (
                    <BiHeart onClick={() => setIsLiked(true)} />
                  )}
                  <BsThreeDotsVertical />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow-1 d-flex align-items-center">
            <Carousel
              className="w-100"
              interval={null}
              activeIndex={activeIndex}
              onSelect={(i) => setActiveIndex(i)}
            >
              {user_statuses?.map((status, idx) => (
                <Carousel.Item key={idx}>
                  <div className="d-flex h-100 align-items-center justify-content-center">
                    <img
                      src={status?.image}
                      alt="status"
                      className="h-100 w-100"
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
};

export const StatusCarousel = () => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, { image: imageUrl }]);
    }
  };

  return (
    <div className="position-relative w-100" style={{ maxWidth: 400 }}>
      {/* Carousel */}
      <div className="flex-grow-1 d-flex align-items-center">
        <Carousel className="w-100" interval={null}>
          {images.map((status, idx) => (
            <Carousel.Item key={idx}>
              <div className="d-flex h-100 align-items-center justify-content-center">
                <img
                  src={status.image}
                  alt={`status-${idx}`}
                  className="h-100 w-100 object-fit-cover"
                  style={{ maxHeight: "250px" }}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Hidden File Input */}
      <input
        id="status"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {/* Circular + Label */}
      <label
        htmlFor="status"
        className="position-absolute d-flex fw-bold align-items-center justify-content-center fs-5 pb-1 w-100 h-100 text-light bg-dark"
        style={{
          bottom: "-20px",
          right: "4px",
          zIndex: 100,
          minHeight: "30px",
          maxWidth: "30px",
          aspectRatio: "1/1",
          borderRadius: "50%",
          cursor: "pointer",
        }}
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        +
      </label>
    </div>
  );
};

export default ParentStatusComponent;
