import { Fragment, useEffect, useState, useRef } from "react";
import { useQuote } from "../src/context/QueotrContext";
import { UserRing } from "../src/maincomponents/EachPost";
import { FollowBtn } from "../src/maincomponents/EachPost";
import { CardPost } from "../src/maincomponents/Home";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../src/context/Theme";
import axios from "axios";
import { Loading } from "./LazyLoading";

export const SearchBaar = () => {
  const [query, setQuery] = useState("");
  const [Filterd_result, setFilterd_result] = useState([]);
  const {
    all_user,
    admin_user,
    setopenSlidWin,
    mobile_break_point,
    API,
    sm_break_point,
  } = useQuote();
  const nevigate = useNavigate();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [limit] = useState(5);
  const [Filterd_posts, setFilterd_posts] = useState([]);

  // Fetch posts from backend (search by title only)

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/api/crud/search?search=${query}&page=${page}&limit=${limit}`
      );

      const data = res?.data?.posts || [];
      console.log("dya ", page);
      if (page == 1) {
        setFilterd_posts(() => []);
      }
      const uniquePosts = Array.from(
        new Map([...Filterd_posts, ...data].map((p) => [p._id, p])).values()
      );

      setFilterd_posts(() => uniquePosts);

      if (data && data.length > 0) {
        setPage((prev) => prev + 1);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      setFilterd_posts(() => []);
      fetchPosts();
      setPage(1);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const f_res = filter_users(all_user, query);
    setFilterd_result(f_res);
  };

  const filter_users = (all_user, query) => {
    if (!query) return [];
    return all_user
      .filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        const indexA = a.username.toLowerCase().indexOf(query.toLowerCase());
        const indexB = b.username.toLowerCase().indexOf(query.toLowerCase());
        return indexA - indexB;
      });
  };

  useEffect(() => {
    const f_res = filter_users(all_user, query);

    const uniquePosts = Array.from(
      new Map(f_res.map((p) => [p._id, p])).values()
    );

    setFilterd_result(uniquePosts);
  }, [query, all_user]);

  const [isTouched, setIsTouched] = useState(false);
  const elementRef = useRef(null);

  const handleTouchOutside = (event) => {
    if (elementRef.current && !elementRef.current.contains(event.target)) {
      setIsTouched(false);
    } else {
      setIsTouched(true);
    }
  };

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchOutside);
    document.addEventListener("mousedown", handleTouchOutside);
    return () => {
      document.removeEventListener("touchstart", handleTouchOutside);
      document.removeEventListener("mousedown", handleTouchOutside);
    };
  }, []);

  const { text_clrH, text_clrM, bg1, bg3, bg2, text_clrL } = useTheme();

  const containerRef = useRef();

  function handleScroll() {
    const div = containerRef.current;

    if (div.scrollTop + div.clientHeight >= div.scrollHeight - 50) {
      fetchPosts();
    }
  }

  return (
    <div className="" ref={elementRef}>
      <div className="p-0 m-0 h-100" onClick={() => {}}>
        <form onSubmit={handleSearch} className="input-group rounded-5 bg-none">
          <input
            type="text"
            className="form-control p-1 ps-3 rounded-5 active_search"
            placeholder="Search vibe here. . . ."
            value={query}
            style={{
              background: "transparent",
              color: text_clrM,
              border: `1px solid ${bg3}`,
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1); // reset page when typing
              setIsTouched(true);
            }}
          />
        </form>
      </div>

      {query.trim() && isTouched && (
        <div
          className="rounded-2 position-absolute overflow-auto none-scroller"
          style={{
            background: bg2,
            border: `1px solid ${text_clrL}`,
            maxHeight: `calc(100vh - ${mobile_break_point ? "104px" : "60px"})`,
            width: `calc(100% - ${
              mobile_break_point ? "6px" : sm_break_point ? "32px" : "20px"
            })`,
            margin: "12px auto",

            maxWidth: "600px",
            left: `${
              mobile_break_point ? "4px" : sm_break_point ? "18px" : "20px"
            }`,
            boxShadow: "0 2px 4px #212121ff",
          }}
          ref={containerRef}
          onScroll={handleScroll}
        >
          <div
            className="d-flex gap-3 p-2 position-sticky top-0"
            style={{ background: bg1 }}
          >
            <div
              className="d-flex flex-column gap-2"
              style={{
                color: text_clrM,
                fontSize: "14px",
                marginTop: "6px",
                minWidth: "18px",
                cursor: "pointer",
              }}
              onClick={(e) => {
                setIsTouched(false);
                e.preventDefault();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                fill={text_clrH}
              >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
            </div>
            <div
              className="gap-2 fs-5 fw-medium "
              style={{
                color: text_clrH,
                fontStyle: "italic",
              }}
            >
              Result for query {query}
            </div>
          </div>

          {/* User results */}
          <div className="d-flex flex-column gap-4 p-2 mb-3">
            {Filterd_result?.map(
              (res, idx) =>
                admin_user?._id !== res?._id &&
                res && (
                  <div className="d-flex align-items-end" key={res._id || idx}>
                    <Fragment>
                      <UserRing user={res} onlyphoto={false} />
                    </Fragment>
                    <div
                      className="border"
                      style={{ minWidth: "104px", maxWidth: "104px" }}
                    >
                      <FollowBtn
                        id={res?._id}
                        cls="btn btn-primary w-100 p-0 ps-3 rounded-0 pe-3 p-1"
                      />
                    </div>
                  </div>
                )
            )}
          </div>
          {Filterd_posts.length > 0 && isTouched && (
            <div className="d-flex flex-column gap-4 p-2 position-relative">
              {Filterd_posts?.map((res, idx) => (
                <div
                  className="d-flex flex-column"
                  key={`F-post${idx}`}
                  style={{
                    color: text_clrM,
                  }}
                >
                  <div className="d-flex gap-3 align-items-start">
                    <div className="mt-">
                      <UserRing
                        user={
                          all_user?.filter((u) => u._id === res?.userId?._id)[0]
                        }
                        onlyphoto={true}
                      />
                    </div>
                    <small
                      className="flex-grow-1 w-100 fw-medium overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {res.text} {/* showing post title */}
                    </small>
                    <div
                      onClick={() => {
                        setopenSlidWin(false);
                        setQuery("");
                        nevigate(`/home/${res._id}`);
                      }}
                    >
                      <CardPost
                        post={res}
                        style={{
                          width: "104px",
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!Filterd_result.length &&
            !Filterd_posts.length &&
            (loading ? (
              <div className="px-4 pb-2">
                <Loading dm={34} />
              </div>
            ) : (
              <p className="p-2" style={{ color: text_clrM }}>
                No result
              </p>
            ))}
        </div>
      )}
    </div>
  );
};
