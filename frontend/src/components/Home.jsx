import { useEffect, useState } from "react";
import axios from "axios";

export const Home = ({ user, comment }) => {
  const [open_comment, setopen_comment] = useState(false);
  const [new_comment, setnew_comment] = useState("");
  const [isliked, setisliked] = useState(false);

  const HandleLike = async (id) => {
    try {
      const res = await axios.put(
        `https://sharehere-2ykp.onrender.com/api/auth/like_this_post`,
        {
          id: id,
          isliked: !isliked,
        }
      );
      setisliked(!isliked);

      // fetchSentences();
      // fetchAllUsers();
      // alert("Login successful! Token: " + res.data.token);
      // localStorage.setItem("token", res.data.token);
      // navigate("/");
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message || err.message);
    }
  };

  const Handlecomment = (e) => {
    setnew_comment(e.target.value);
  };

  // alert(user.bg_clr);
  const token = localStorage.getItem("token");

  const SubmitComment = async (e, id) => {
    e.preventDefault();
    // console.log("form comment ------> ", new_comment);
    try {
      const res = await axios.put(
        `https://sharehere-2ykp.onrender.com/api/auth/set_comment_this_post`,
        {
          headers: { Authorization: `Bearer ${token}` },
          id: id, // post ki id hai
          new_comment: new_comment,
        }
      );
      // setisliked(!isliked);
      setnew_comment("");
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message || err.message);
    }
  };
  return (
    <>
      {/* <h4 className="mt-2">Welcome to Post to Post group : )</h4> */}
      {comment?.text?.trim() && (
        <>
          <div
            className="d-flex flex-column mt-3 w-100"
            style={{ background: "#f5f5f5" }}
            key={comment?.text?.slice(0, -1)}
          >
            <div className="d-flex gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-crcle text-white"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "20px",
                  borderEndStartRadius: "0px",
                  borderStartEndRadius: "0px",
                  borderStartStartRadius: "0",
                  background: `${user.bg_clr}`,
                }}
              >
                <div>{user?.username?.charAt(0).toUpperCase()}</div>
              </div>

              <div className=" d-flex flex-column small align-item">
                <small className="small">@{user?.username}</small>
                <small className="small">{comment?.text}</small>
              </div>
            </div>

            <div className="w-100 ps-1">
              <ul style={{ listStyle: "none" }} className="p-0 m-0">
                <li className="p-2 w-100 flex-grow-1 rounded-3">
                  {comment && (
                    <div key={comment.text.slice(0, -1)}>{comment.text}</div>
                  )}
                </li>
              </ul>
            </div>

            <div className="p-2 border-top d-flex justify-content-between small like-comment-share">
              <small
                className="pe-3 p-1 fw-semibold"
                onClick={() => {
                  HandleLike(comment._id);
                }}
                style={{ color: `${isliked ? "#ff6600" : ""}` }}
              >
                {comment?.likes}&nbsp;likes
              </small>
              <small
                className="ps-3 pe-3 p-1 fw-semibold"
                onClick={() => {
                  setopen_comment(!open_comment);
                }}
              >
                {" "}
                {comment?.comments?.length || 0}&nbsp;comment
              </small>
              <small className="ps-3 p-1 fw-semibold">share</small>
            </div>
          </div>
          {open_comment && (
            <>
              <div className="p-2 gap-3 border border-top-0 border-bottom-0 d-flex flex-column position-relative">
                <textarea
                  // value={text}
                  // onChange={(e) => setText(e.target.value)}
                  required
                  className="form-control shadow-none"
                  placeholder="Write your sentence here..."
                  rows={4}
                  onChange={(e) => {
                    Handlecomment(e);
                  }}
                  value={new_comment || ""}
                />

                <div
                  className="d-flex gap-3"
                  style={{ alignSelf: "end", bottom: "0.5rem" }}
                >
                  <button
                    className="btn btn-outline-dark ps-3 pe-3 rounded-0"
                    style={{ alignSelf: "end", bottom: "0.5rem" }}
                    onClick={(e) => {
                      setopen_comment(!open_comment);
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-outline-danger ps-3 pe-3 rounded-0"
                    onClick={(e) => {
                      SubmitComment(e, comment._id);
                    }}
                  >
                    leave a comment
                  </button>
                </div>
              </div>

              <div className="border p-2">
                {comment?.comments?.map((pc, idx) => {
                  return (
                    <>
                      <div className="d-flex gap-1 mt-2" key={idx}>
                        <div
                          className="d-flex align-items-center justify-content-center rounded-crcle text-white"
                          style={{
                            minWidth: "30px",
                            height: "30px",
                            borderRadius: "20px",
                            background: `${pc?.userId?.bg_clr}`,
                            // borderEndStartRadius: "0px",
                            // borderStartEndRadius: "0px",
                            // borderStartStartRadius: "0",
                          }}
                        >
                          <span>
                            {pc?.userId?.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="small">
                          <small className="fw-semibold">
                            @{pc?.userId?.username}
                          </small>
                          <div key={idx} className="fs-6">
                            {pc.text}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};
