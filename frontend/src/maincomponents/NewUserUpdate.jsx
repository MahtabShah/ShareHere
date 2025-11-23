import { Fragment, useEffect, useState } from "react";
import { useQuote } from "../context/QueotrContext";
import { UserRing, FollowBtn } from "./EachPost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "../context/Theme";
import { usePost } from "../context/PostContext";
import { throttle } from "lodash";
import { useNavigate } from "react-router-dom";

import { Rank_Calculation } from "../context/PostContext";

const parentStyle = {
  position: "sticky",
  width: "340px",
  top: "154px",
  height: "90vh",
  marginTop: "164px",
};

const SuggetionSlip = () => {
  const { all_user, admin_user, lgbreakPoint } = useQuote();
  const { text_clrM, bg1 } = useTheme();
  const { posts } = usePost();

  console.log("user ", all_user[0]);

  return (
    <>
      <div style={{ ...parentStyle }}>
        {lgbreakPoint && (
          <div className="user-update" style={{ color: text_clrM }}>
            {admin_user ? (
              <>
                <div className="d-flex flex-column gap-2">
                  <div
                    key={admin_user?.username}
                    className="d-flex align-items-center gap-2 mb-2 rounded"
                  >
                    <UserRing user={admin_user} dm={50} style={{}} />
                    <a
                      href={`/api/user/${admin_user?._id}`}
                      className="small btn btn-outline-primary text-center rounded-1 p-1 ps-3 pe-3"
                      style={{ minWidth: "max-content" }}
                    >
                      see profile
                    </a>
                  </div>
                </div>
                <p className="my-3 pb-2 small">Suggested For You</p>
              </>
            ) : (
              posts?.length > 0 && (
                <div className="d-flex flex-column gap-2">
                  <div
                    key={admin_user?.username}
                    className="d-flex align-items-center justify-content-between gap-2 mb-2 rounded"
                  >
                    <div
                      className="h-100 d-flex rounded-5 align-items-center justify-content-center"
                      style={{
                        border: "2px solid #d55163ff",
                        minHeight: "50px",
                        width: "50px",
                        background: `linear-gradient(120deg, #fda, #e40d29ff)`,
                      }}
                      alt=""
                    >
                      ?
                    </div>

                    <a href="/signup" className="small btn btn-info">
                      Signin/login
                    </a>
                  </div>
                </div>
              )
            )}

            {all_user?.length > 0 && (
              <>
                <div className="d-flex flex-column gap-3 mt-2">
                  <div className="d-flex flex-column gap-2">
                    {all_user
                      ?.filter((u) => !u?.followers?.includes(admin_user?._id))
                      .slice(-4)
                      .reverse()
                      .map(
                        (user) =>
                          user?._id != admin_user?._id && (
                            <div
                              key={user.username}
                              className="d-flex align-items-center gap-5 pb-3 rounded"
                            >
                              <UserRing user={user} style={{}} dm={52} />
                              <div>
                                <FollowBtn
                                  id={user?._id}
                                  cls={
                                    "btn btn-outline-primary text-center rounded-1 p-1 ps-3 pe-3"
                                  }
                                  style={{
                                    cursor: "pointer",
                                    width: "104px",
                                  }}
                                />
                              </div>
                            </div>
                          )
                      )}
                  </div>
                </div>

                <small
                  className="text-center footer mt-4 d-flex gap-2 flex-column justify-content-center align-items-center"
                  style={{ color: text_clrM }}
                >
                  <div className="d-flex gap-2">
                    <a href="#">Info</a>
                    <a href="#">help</a>
                    <a href="#">privacy</a>
                    <a href="#">terms</a>
                  </div>
                  <a href="#"> write a review</a>
                  <div className="d-flex gap-2">
                    <a href="#">locations</a>
                    <a href="#">languages</a> &amp; more @ 2025 ShareHere
                  </div>
                </small>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export const SuggetionSlipInPost = () => {
  const { all_user, admin_user, token } = useQuote();
  const [some_user, setsome_user] = useState(null);
  const { text_clrH, text_clrL, text_clrM, mainbg, bg1, bg2 } = useTheme();

  useEffect(() => {
    const rn = Math.floor(Math.random() * (all_user.length - 5) || 0);

    const some_u = all_user
      .filter((u) => !u?.followers?.includes(admin_user?._id))
      .slice(rn, rn + 5);

    setsome_user(some_u);
  }, [token]);

  // console.log(all_user, admin_user?._id);

  // console.log(some_user);

  return (
    <>
      {some_user?.map((u, i) => {
        return (
          <Fragment key={`$i-${i}`}>
            <div
              className="d-flex rounded-2 flex-column position-relative align-items-center py-3 px-4  gap-2"
              style={{
                border: "1px solid #ccc",
                background: bg1,
                color: text_clrH,
              }}
            >
              <div className="p-2" style={{ width: "120px", height: "120px" }}>
                <a href={`/api/user/${u?._id}`}>
                  <img
                    src={u.profile_pic}
                    alt=""
                    className="h-100 w-100"
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                  />
                </a>
              </div>
              <small className="d-flex fle-column gap-3 justify-content-center w-100 text-light">
                <small
                  style={{
                    color: text_clrM,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  @{u.username.slice(0, 10)}
                </small>
                <FollowBtn
                  id={u?._id}
                  cls={"text-primary small"}
                  style={{ cursor: "pointer" }}
                />
              </small>
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

function getCols(width) {
  if (width >= 520) return 4;
  else if (width >= 392) return 3;
  else if (width >= 264) return 2;
  return 1;
}

export const GalleryPost = ({ category }) => {
  const [columns, setColumns] = useState(() => getCols(window.innerWidth));
  const { text_clrH, text_clrL } = useTheme();
  const { limit, page, post_loading, fetch_n_posts } = usePost();
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetch_n_posts(limit, page, category);
      console.log(data);
      const sorted = data
        .map((post) => ({
          ...post,
          rank: Rank_Calculation(post),
        }))
        .sort((a, b) => b.rank - a.rank);

      setPosts((prev) => [...prev, ...sorted]);
    })();
  }, [category]);

  useEffect(() => {
    function handleResize() {
      setColumns(getCols(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Split posts into a 2D array: columnsArr[colIndex] = array of posts
  const columnsArr = Array.from({ length: columns }, () => []);

  posts.forEach((post, idx) => {
    const colIndex = idx % columns; // distribute across columns
    columnsArr[colIndex].push(post);
  });

  const navigate = useNavigate();

  const Track_post = (postId) => {
    const target = document.getElementById(postId);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/home/${postId}`);
    }
  };

  const FetchMore = () => {
    (async () => {
      const data = await fetch_n_posts(limit, page, category);
      if (data?.length > 0) {
        const sorted = data
          .map((post) => ({
            ...post,
            rank: Rank_Calculation(post),
          }))
          .sort((a, b) => b.rank - a.rank);

        setPosts((prev) => [...prev, ...sorted]);
      } else {
        setExpanded(false);
        console.log("posts");
      }
    })();
  };

  return (
    <div className="position-relative p-1">
      <div
        className="h-100"
        style={{
          display: "flex",
          gap: "12px",
          paddingBlock: "10px",
          // maxHeight: expanded ? "none" : "400px",
          overflow: expanded ? "visible" : "hidden",
        }}
      >
        {columnsArr.map((colPosts, colIdx) => (
          <div
            key={colIdx}
            className={`rounded col-${colIdx + 1}`}
            style={{ flex: 1 }}
          >
            {colPosts.map((p, i) => (
              <img
                key={`i-${colIdx}-${i}`}
                src={p?.images[0]}
                className="w-100 my-2 rounded"
                style={{ boxShadow: `0 1px 2px ${text_clrL}` }}
                onClick={() => {
                  Track_post(p?._id);
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {expanded && (
        <>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "200px",
              background:
                "linear-gradient(rgba(255,255,255,0) 10%, rgba(126, 157, 186, 1) 56%)",
            }}
          ></div>
          <button
            onClick={FetchMore}
            style={{
              position: "absolute",
              bottom: "15px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "6px 16px",
              borderRadius: "20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
            }}
          >
            See more
          </button>
        </>
      )}
    </div>
  );
};

export default SuggetionSlip;
