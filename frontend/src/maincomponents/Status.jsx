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
import { motion, AnimatePresence } from "framer-motion";

import axios from "axios";

const ParentStatusComponent = () => {
  const {
    selectedUserId,
    all_statuses,
    all_user,
    fetch_user_statuses,
    setSelectedUserId,
    admin_user,
  } = useQuote();

  const [following_have_status, setfollowing_have_status] = useState([]);

  useEffect(() => {
    fetch_user_statuses();
  }, []);

  useEffect(() => {
    if (!admin_user?.following || !all_user) return;

    const followedWithStatus = all_user.filter(
      (u) => admin_user.following.includes(u._id) && u?.status?.length > 0
    );

    // Place admin_user at index 0 if they have any status
    const isAdminInList = followedWithStatus.some(
      (u) => u._id === admin_user._id
    );
    let finalList;

    if (admin_user?.status?.length > 0) {
      if (isAdminInList) {
        // Move admin_user to front
        finalList = [
          followedWithStatus.find((u) => u._id === admin_user._id),
          ...followedWithStatus.filter((u) => u._id !== admin_user._id),
        ];
      } else {
        // Add admin_user to front
        finalList = [admin_user, ...followedWithStatus];
      }
    } else {
      finalList = followedWithStatus;
    }

    setfollowing_have_status(finalList);
  }, [admin_user, all_user, all_statuses]);

  return (
    <div className="d-flex gap-3">
      {following_have_status?.map((el, idx) => (
        <Fragment key={el._id}>
          <StatusRing user={el} userIdx={idx} />
        </Fragment>
      ))}

      {selectedUserId && (
        <div
          className="position-fixed bg-dark"
          style={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: 100000000 }}
        >
          <StatusPage
            userId={selectedUserId}
            all_statuses_user={following_have_status}
          />
        </div>
      )}
    </div>
  );
};

// ✅ StatusRing Component

export const StatusRing = ({ user, userIdx }) => {
  const [user_statuses, setUser_statuses] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const { setSelectedUserId, admin_user, all_statuses, API, setUploadClicked } =
    useQuote();

  useEffect(() => {
    const statuses = all_statuses?.filter((s) => s?.user?._id === user?._id);
    setUser_statuses(statuses);
  }, [all_statuses, user]);

  useEffect(() => {
    const seen = user_statuses[0]?.SeenBy?.includes(admin_user?._id) || false;
    setIsClicked(seen);
  }, [user_statuses, admin_user]);

  return (
    <>
      {user && (
        <div className="status-item d-flex align-items-center justify-content-center">
          <div
            className={`d-flex align-items-center justify-content-center status-ring  ${
              isClicked ? "" : "status-ring-grad"
            }`}
          >
            <div
              className="status-image bg-light overflow-hidden"
              onClick={() => {
                if (user_statuses?.length > 0) setSelectedUserId(user?._id);
                // ThisUserClickedStatus();
              }}
            >
              <img src={user?.profile_pic} alt="" className="w-100 h-100" />
            </div>

            {admin_user?._id === user?._id && (
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
                  setUploadClicked(true);
                }}
              >
                +
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export const StatusPage = ({ userId, all_statuses_user }) => {
  const [user_statuses, setUser_statuses] = useState([]);
  const [user, setUser] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const {
    setSelectedUserId,
    all_statuses,
    admin_user,
    all_user,
    selectedUserId,
    API,
  } = useQuote();

  const duration = 4000;

  // Load current user's statuses
  useEffect(() => {
    const statuses = all_statuses?.filter((s) => s?.user?._id === userId);
    setUser_statuses(statuses || []);
    setActiveIndex(0); // Reset
  }, [userId, all_statuses]);

  // When status ends
  useEffect(() => {
    if (paused || user_statuses.length === 0) return;
    if (activeIndex >= user_statuses.length) {
      const index = all_statuses_user.findIndex(
        (u) => u._id === selectedUserId
      );
      if (index < all_statuses_user.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setSelectedUserId(all_statuses_user[index + 1]._id);
          setIsTransitioning(false);
        }, 500);
      } else {
        setSelectedUserId(null); // end
      }
    }
  }, [activeIndex, paused]);

  const ThisUserClickedStatus = async (user_statuses) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API}/api/crud/set_status_seen/${admin_user?._id}`,
        { user_statuses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.log("error during status ", error);
    }
  };

  useEffect(() => {
    ThisUserClickedStatus(user_statuses);
  }, [user_statuses]);

  const handlePause = () => setPaused(true);
  const handleResume = () => setPaused(false);

  useEffect(() => {
    setUser(all_user?.filter((u) => u._id === userId)[0]);
    console.log("user.............................", user);
  }, [userId]);

  return (
    <AnimatePresence>
      {!isTransitioning && (
        <motion.div
          key={userId}
          className="border bg-light w-100 overflow-hidden mt-2 mb-2 d-flex align-items-center flex-column position-relative"
          style={{
            height: "100dvh",
            margin: "auto",
            maxWidth: "520px",
            transform: "scale(0.9)",
          }}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.4 }}
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
                  paused={paused}
                  index={idx}
                />
              ))}
            </div>

            {/* Header */}
            <div className="d-flex align-items-center m-2 gap-2">
              <FaArrowLeft
                size={24}
                onClick={() => setSelectedUserId(null)}
                style={{ cursor: "pointer" }}
              />
              <div className="d-flex justify-content-between w-100 gap-3 pe-1">
                <div className="flex-grow-1 d-flex gap-2">
                  <img
                    src={user_statuses[0]?.image}
                    alt=""
                    className="rounded-circle"
                    style={{ width: 44, height: 44 }}
                  />
                  <div>
                    <span>{user?.username}</span>
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

          {/* Status Image */}
          <div className="flex-grow-1 d-flex align-items-center">
            <Carousel
              className="w-100"
              interval={null}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
              onMouseEnter={handlePause}
              onMouseLeave={handleResume}
              onTouchStart={handlePause}
              onTouchEnd={handleResume}
            >
              {user_statuses.map((status, idx) => (
                <Carousel.Item key={idx}>
                  <div className="d-flex h-100 align-items-center justify-content-center">
                    <img
                      src={status?.image}
                      alt="status"
                      className="h-100 w-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProgressBar = ({
  duration,
  condition,
  index,
  activeIndex,
  setActiveIndex,
  paused,
}) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!condition) {
      setProgress(0);
      return;
    }

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!paused) {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            setActiveIndex((prevIndex) => prevIndex + 1); // 🔁 move to next
            return 100;
          }
          return prev + 1;
        });
      }
    }, duration / 100);

    return () => clearInterval(intervalRef.current);
  }, [condition, paused]);

  return (
    <div style={{ width: "100%", height: "4px", background: "#ddd" }}>
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: "linear-gradient(to right, #4facfe, #00f2fe)",
          transition: "width 0.1s linear",
        }}
      ></div>
    </div>
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
