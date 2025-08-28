import "../../src/Status.css";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTheme } from "../context/Theme";
import { useQuote } from "../context/QueotrContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { usePost } from "../context/PostContext";
import socket from "./socket";
import { FaEllipsisH, FaEllipsisV } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const StatusList = ({ users, openStatus }) => {
  const { bg2, bg1, text_clrM, text_clrH, text_clrL } = useTheme();
  const { admin_user, setActiveIndex, setopenSlidWin } = useQuote();

  return (
    <>
      <div className="p-2" style={{ marginTop: "54px" }}>
        {/* Status List */}
        <div className="d-flex gap-4 mb-2">
          {users?.map(
            (u, i) =>
              (admin_user?._id === u?._id || u?.status?.length > 0) && (
                <div
                  key={i}
                  className="text-center position-relative"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (admin_user?._id === u?._id && u?.status?.length === 0) {
                      setActiveIndex("Upload");
                      setopenSlidWin("Upload");
                    } else openStatus(i, 0);
                  }}
                >
                  <img
                    src={u?.profile_pic}
                    alt={u?.username}
                    className="rounded-circle p-1"
                    width="80"
                    height="80"
                    style={{
                      objectFit: "cover",
                      border: u?.status?.every((s) =>
                        s?.SeenBy?.some(
                          (seenUserId) => seenUserId === admin_user?._id
                        )
                      )
                        ? `3px solid ${text_clrH}`
                        : "3px solid #ed0d32ff",
                    }}
                  />
                  <div className="small mt-1" style={{ color: text_clrM }}>
                    {u?.username}
                  </div>
                  {admin_user?._id === u?._id && (
                    <div
                      className="position-absolute rounded-circle d-flex  fw-bold fs-5 "
                      style={{
                        background: bg1,
                        color: text_clrL,
                        bottom: "30px",
                        right: 0,
                        width: "20px",
                        height: "20px",
                        border: `1px solid ${text_clrH}`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex("Upload");
                        setopenSlidWin("Upload");
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        fontSize={12}
                        className="m-auto"
                        color={text_clrH}
                      />
                    </div>
                  )}
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
};

export default function StatusPage() {
  const { admin_user, API, token, setadmin_user } = useQuote();
  const { fetch_user_by_Id } = usePost();
  const [users, setUsers] = useState([]);
  // console.log(admin_user);

  useEffect(() => {
    (async () => {
      const user = await fetch_user_by_Id(admin_user?._id);
      console.log("user with status", user);
      setUsers(() =>
        [user, user?.following?.filter((f) => f?.status?.length > 0)].flat()
      );
    })();
  }, [
    admin_user,
    admin_user?.status,
    admin_user?.followers,
    admin_user?.following,
  ]);

  const [currentUserIndex, setCurrentUserIndex] = useState(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [blink, setBlink] = useState(false);
  const progressRef = useRef(null);
  const [dots, setDots] = useState(-1);
  const [Onhover, setOnhover] = useState(true);

  var currentUser = currentUserIndex !== null ? users[currentUserIndex] : null;
  const currentStatus = currentUser && currentUser?.status[currentStatusIndex];

  // Handle autoplay progress
  useEffect(() => {
    if (currentUserIndex !== null && currentStatus) {
      setProgress(0);
      setDots(-1);

      if (currentStatus && !currentStatus?.SeenBy?.includes(admin_user?._id)) {
        // Mark status as
        console.log("currentStatus", currentStatus);

        (async () => {
          try {
            const res = await axios.put(
              `${API}/api/crud/set_status_seen/${admin_user?._id}`,
              {
                user_statuses: users?.[currentUserIndex]?.status,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("Created status:", res?.data);
          } catch (err) {
            console.error("Error creating status:", err);
          }
        })();
      }

      HandleBar();

      return () => clearInterval(progressRef.current);
    }
  }, [currentUserIndex, currentStatusIndex]);

  const openStatus = async (userIndex, statusIndex) => {
    if (users[userIndex]?.status?.length === 0) {
      // Skip users without status
      const next = (userIndex + 1) % users?.length;
      openStatus(next, 0);
      setDots(-1);
      return;
    }
    setCurrentUserIndex(userIndex);
    setCurrentStatusIndex(statusIndex);
  };

  const handleNext = () => {
    setBlink(true);
    setDots(-1);
    setTimeout(() => setBlink(false), 140);
    if (!currentUser) return;
    if (currentStatusIndex < currentUser.status.length - 1) {
      setCurrentStatusIndex(currentStatusIndex + 1);
    } else {
      // find next user with status
      if (currentUserIndex + 1 === users.length) {
        closeModal();
        return;
      }
      let next = (currentUserIndex + 1) % users.length;

      for (let i = 0; i < users.length; i++) {
        if (users[next].status.length > 0) {
          setCurrentUserIndex(next);
          setCurrentStatusIndex(0);
          return;
        }
        next = (next + 1) % users.length;
      }
      closeModal();
    }
  };

  const handlePrev = () => {
    setBlink(true);
    setDots(-1);
    setTimeout(() => setBlink(false), 140);
    if (!currentUser) return;
    if (currentStatusIndex > 0) {
      setCurrentStatusIndex(currentStatusIndex - 1);
    } else {
      // find previous user with status
      if (currentUserIndex === 0) {
        closeModal();
        return;
      }

      let prev = (currentUserIndex - 1 + users.length) % users.length;
      for (let i = 0; i < users.length; i++) {
        if (users[prev].status.length > 0) {
          setCurrentUserIndex(prev);
          setCurrentStatusIndex(users[prev].status.length - 1);
          return;
        }
        prev = (prev - 1 + users.length) % users.length;
      }
      closeModal();
    }
  };

  const closeModal = () => {
    setCurrentUserIndex(null);
    setCurrentStatusIndex(0);
    clearInterval(progressRef.current);
  };

  const { bg1, bg2, bg3, text_clrH, text_clrL } = useTheme();

  useEffect(() => {
    socket.on("status", async () => {
      const data = await fetch_user_by_Id(admin_user?._id);
      console.log("status update received", data);

      if (data) {
        setadmin_user(data);
      }
    });

    return () => {
      socket.off("status"); // cleanup on unmount
    };
  }, []);

  const HandleDelteStatus = async () => {
    // alert("Are you sure you want to delete this status?");
    // console.log("Delete status at index:", admin_user?._id, currentStatus);
    try {
      // console.log(
      //   "Deleting status:",
      //   currentUser?.status?.filter((s) => s !== currentStatus)
      // );
      if (currentUser?.status?.length === currentStatusIndex + 1) {
        openStatus(currentUserIndex + 1, 0);
      }

      currentUser.status = currentUser?.status?.filter(
        (s) => s !== currentStatus
      );

      setBlink(true);
      setTimeout(() => setBlink(false), 200);
      setDots(-1);
      setProgress(0);

      // openStatus(currentUserIndex, 0);

      const res = await axios.delete(`${API}/api/crud/delete_status`, {
        data: { status_id: currentStatus?._id, id: admin_user?._id },

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Error deleting status:", err);
    }
  };

  const HandleBar = () => {
    // Resume on mouse out
    if (dots !== currentStatusIndex && Onhover) {
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressRef?.current);
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 50);
    }
  };

  return (
    <div>
      {/* Status Modal */}
      {users && <StatusList users={users} openStatus={openStatus} />}

      {currentUser && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-90 d-flex p-2  justify-content-center align-items-center"
          style={{
            zIndex: 99999991050,
          }}
        >
          <div
            className="position-relative rounded border-0 bg-dark  h-100 w-100"
            style={{
              maxWidth: "500px",
              backgroundImage: `url(${currentStatus?.image})`,
              backgroundSize: "400% 100%",
              backgroundPosition: "center",
            }}
          >
            <div
              className="p-2 h-100 rounded position-relative"
              style={{
                backdropFilter:
                  "blur(20px) saturate(1.4) brightness(0.7) sepia(0.1) hue-rotate(-3deg) opacity(0.85)",
              }}
            >
              {/* Progress bars */}
              <div className="d-flex gap-1 mb-2">
                {currentUser?.status?.map((_, i) => (
                  <div
                    key={i}
                    className="flex-fill bg-secondary"
                    style={{ height: "3px" }}
                  >
                    <div
                      className="bg-light"
                      style={{
                        width:
                          i < currentStatusIndex
                            ? "100%"
                            : blink
                            ? 0
                            : i === currentStatusIndex
                            ? `${progress}%`
                            : "0",
                        height: "100%",
                        transition: blink ? "" : "width 0.05s linear",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* User Info */}
              <div className="d-flex text-white mt-3">
                <div className="flex-grow-1 d-flex h-100">
                  <img
                    src={currentUser?.profile_pic}
                    alt="profile_pic"
                    className="rounded-circle me-2 mb-2"
                    width="50"
                    height="50"
                  />
                  <div className="">
                    <div className="fw-semibold">
                      {currentUser?.username}
                      {dayjs(currentStatus?.createdAt).fromNow() ===
                      "a few seconds ago"
                        ? " • just now "
                        : " • " + dayjs(currentStatus?.createdAt).fromNow()}
                    </div>
                    <div
                      className="small"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {currentStatus.text}
                    </div>
                    {/* <div className="small text-muted">{currentStatus.time}</div> */}
                  </div>
                </div>

                <div
                  onClick={() => {
                    setDots(
                      dots === currentStatusIndex ? -1 : currentStatusIndex
                    );

                    if (dots === currentStatusIndex) {
                      () => clearInterval(progressRef?.current);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                  className="p-2 d-flex align-items-center"
                >
                  <FaEllipsisV size={14} />
                </div>

                {dots === currentStatusIndex && (
                  <div
                    className="d-flex flex-column gap-2 position-absolute p-2 rounded-1"
                    style={{
                      background: bg2,
                      zIndex: 1050,
                      right: "40px",
                      top: "45px",
                    }}
                  >
                    <button
                      className="btn w-100 btn-light p-1 px-4 rounded-1"
                      onClick={closeModal}
                    >
                      {/* <FontAwesomeIcon icon={faTimes} color={bg2} /> */}
                      Close
                    </button>

                    {currentStatus?.user === admin_user?._id && (
                      <button
                        className="btn btn-danger w-100 p-1 px-4 text-light rounded-1"
                        onClick={HandleDelteStatus}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Status Image */}

              <div
                className="w-100  d-flex flex-column align-items-center position-relative"
                style={{
                  height: "calc(100% - 80px)",
                  justifyContent: "flex-start",
                }}
                onClick={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  if (e.clientX - rect.left > rect.width / 2) {
                    handleNext();
                  } else {
                    handlePrev();
                  }
                }}
              >
                <img
                  src={currentStatus?.image}
                  alt="status"
                  className="w-100"
                  style={{
                    borderRadius: "7px",
                    objectFit: "cover",
                    maxHeight: "100%",
                  }}
                />
              </div>

              {/* Controls */}
              <button
                className="btn position-absolute top-50 start-0 text-white fs-3"
                onClick={handlePrev}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn position-absolute top-50 end-0 text-white fs-3"
                onClick={handleNext}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
