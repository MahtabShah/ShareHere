const API = import.meta.env.VITE_API_URL;
import { useNavigate, useParams } from "react-router-dom";
import { usePost } from "../context/PostContext";
import { useEffect } from "react";
import { useState } from "react";
import { Loading } from "../../TinyComponent/LazyLoading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { BsThreeDotsVertical } from "react-icons/bs";
import { useTheme } from "../context/Theme";
import { useQuote } from "../context/QueotrContext";
import axios from "axios";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";

export const CommentSection = ({ postId, comments, setComments, user }) => {
  const navigate = useNavigate();
  const { fetch_comments_postId } = usePost();
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null); // store id of open menu
  const { bg3, text_clrH, text_clrL } = useTheme();
  const { API, token, admin_user } = useQuote();

  // console.log(comments);

  const CommentFn = async () => {
    setLoading(true);
    const postComment = await fetch_comments_postId(postId);
    setComments(postComment);
    setLoading(false);
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${API}/api/crud/${commentId}`, {
        data: {
          adminId: admin_user?._id,
          postId: postId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleReport = async (commentId) => {
    console.log("ic", commentId);
    try {
      await axios.post(
        `${API}/api/crud/report/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Comment reported . . .!!!");
    } catch (err) {
      console.error("Report failed:", err);
      alert("Failed to report");
    }
  };

  useEffect(() => {
    CommentFn();
  }, [postId]);

  return (
    <div className="pb-3">
      {comments.length > 0 ? (
        comments.map((pc) => (
          <div className="d-flex gap-2 mt-3" key={pc._id}>
            {/* Avatar */}
            <div
              className="d-flex align-items-center overflow-hidden justify-content-center rounded-circle text-white"
              style={{
                maxWidth: "40px",
                minWidth: "40px",
                height: "40px",
                borderRadius: "20px",
                background: `${pc?.userId?.bg_clr}`,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/api/user/${pc?.userId?._id}`)}
            >
              {/* <span>{pc?.userId?.username?.charAt(0).toUpperCase()}</span> */}
              <img
                src={pc?.userId?.profile_pic}
                alt=""
                className="h-100 w-100"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Comment content */}
            <div className="small w-100 position-relative">
              <div className="d-flex gap-2 justify-content-between">
                <span>
                  <small className="fw-semibold">@{pc?.userId?.username}</small>
                  <small> {dayjs(pc?.createdAt).fromNow()}</small>
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setMenuOpenId((prev) => (prev === pc._id ? null : pc._id))
                  }
                >
                  <BsThreeDotsVertical />
                </span>
              </div>

              <div className="fs-6 d-flex flex-column align-items-start gap-0">
                <p className="p-0 m-0">{pc?.text}</p>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm p-0 border-0"
                    style={{ color: text_clrH, cursor: "pointer" }}
                    onClick={async () => {
                      try {
                        const { data } = await axios.put(
                          `${API}/api/crud/like/${pc._id}`,
                          {},
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        // update UI instantly
                        setComments((prev) =>
                          prev.map((c) =>
                            c._id === pc._id ? { ...c, likes: data.likes } : c
                          )
                        );
                      } catch (err) {
                        console.error("Error liking comment:", err);
                      }
                    }}
                  >
                    {pc.likes?.includes(admin_user?._id) ? (
                      <AiFillLike size={14} />
                    ) : (
                      <AiOutlineLike size={14} />
                    )}{" "}
                    <small className="">{pc.likes?.length || 0}</small>
                  </button>

                  <button
                    className="btn btn-sm pb-2 p-0 border-0 d-flex align-items-center gap-1"
                    style={{
                      color: pc.dislikes?.includes(admin_user?._id)
                        ? "red"
                        : text_clrH,
                      cursor: "pointer",
                      background: "transparent",
                      rotate: "180deg",
                    }}
                    onClick={async () => {
                      try {
                        const { data } = await axios.put(
                          `${API}/api/crud/dislike/${pc._id}`,
                          {},
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        setComments((prev) =>
                          prev.map((c) =>
                            c._id === pc._id
                              ? {
                                  ...c,
                                  likes: data.likes,
                                  dislikes: data.dislikes,
                                }
                              : c
                          )
                        );
                      } catch (err) {
                        console.error("Error disliking comment:", err);
                      }
                    }}
                  >
                    {pc.dislikes?.includes(admin_user?._id) ? (
                      <AiFillLike size={14} />
                    ) : (
                      <AiOutlineLike size={14} />
                    )}
                    {/* <small>{pc.dislikes?.length || 0}</small> */}
                  </button>
                </div>
              </div>

              {/* Menu */}
              {menuOpenId === pc._id && (
                <div
                  className="position-absolute top-0 p-1 rounded-1"
                  style={{
                    right: "24px",
                    width: "104px",
                    background: bg3,
                    border: `1px solid ${text_clrL}`,
                    zIndex: 10,
                  }}
                >
                  {(pc?.userId?._id == admin_user?._id ||
                    user?._id == admin_user?._id) && (
                    <button
                      className="btn w-100 border-0 p-0 py-1 rounded-2"
                      style={{ color: text_clrH }}
                      onClick={() => handleDelete(pc._id)}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className="btn w-100 border-0 py-1 p-0 rounded-2"
                    style={{ color: text_clrH }}
                    onClick={() => handleReport(pc._id)}
                  >
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="px-2">{loading ? <Loading /> : <p>No comments</p>}</div>
      )}
    </div>
  );
};

export const CardPost = ({
  post,
  style = { height: "100%", width: "100%" },
}) => {
  return (
    <>
      <div
        className="p-0 m-0 position-relative w-100"
        style={{
          // aspectRatio: "3/4",
          height: "100%",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        <div className="w-100 h-100 bg-image">
          <img
            src={post?.images[0]} // 400px for mobile-friendly width
            loading="lazy"
            style={{ objectFit: "contain", ...style }}
          />
        </div>
      </div>
    </>
  );
};
