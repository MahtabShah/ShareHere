import { Fragment, useEffect, useState, useRef } from "react";
import { useQuote } from "../src/context/QueotrContext";
import { UserRing } from "../src/maincomponents/EachPost";
import { FollowBtn } from "../src/maincomponents/EachPost";
import { CardPost } from "../src/maincomponents/Home";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../src/context/Theme";

export const SearchBaar = () => {
  const [query, setQuery] = useState("");
  const [Filterd_result, setFilterd_result] = useState([]);
  const [Filterd_posts, setFilterd_posts] = useState([]);
  const { all_user, all_posts, admin_user, setopenSlidWin } = useQuote();
  const nevigate = useNavigate();

  // const [search_text, setSearch_text] = useState("");

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
        // Sort by index of match (lower index = better match)
        const indexA = a.username.toLowerCase().indexOf(query.toLowerCase());
        const indexB = b.username.toLowerCase().indexOf(query.toLowerCase());
        return indexA - indexB;
      })
      .slice(0, 3); // Return only top 3 matches
  };

  useEffect(() => {
    const f_res = filter_users(all_user, query);
    setFilterd_result(f_res);
  }, [query, all_user]);

  const filter_posts = (all_posts, query) => {
    if (!query) return [];

    return all_posts
      .filter((post) => post.text.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        // Sort by index of match (lower index = better match)
        const indexA = a.text.toLowerCase().indexOf(query.toLowerCase());
        const indexB = b.text.toLowerCase().indexOf(query.toLowerCase());
        return indexA - indexB;
      })
      .slice(0, 3); // Return only top 3 matches
  };

  const [isTouched, setIsTouched] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const f_res = filter_posts(all_posts, query);
    setFilterd_posts(f_res);
    setIsTouched(f_res.length > 0 || Filterd_result.length > 0);
  }, [query]);

  const handleTouchOutside = (event) => {
    if (elementRef.current && !elementRef.current.contains(event.target)) {
      setIsTouched(false); // touched outside
    } else {
      setIsTouched(true); // touched inside
    }
  };

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchOutside);
    document.addEventListener("mousedown", handleTouchOutside); // for mouse click

    return () => {
      document.removeEventListener("touchstart", handleTouchOutside);
      document.removeEventListener("mousedown", handleTouchOutside);
    };
  }, []);

  // SearchBaar.jsx

  const trend = [
    "Motivational",
    "Parents",
    "Study",
    "Funney",
    "Dosti",
    "Life Changing",
    "Sigma",
    "Willone",
  ];

  const { text_clrH, text_clrL, text_clrM, mainbg, bg1, bg2, bg3 } = useTheme();

  return (
    <div className="" ref={elementRef}>
      <div className=" p-0 m-0 h-100">
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
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      {Filterd_posts.length > 0 && isTouched && (
        <div
          className="rounded-3 position-absolute overflow-auto none-scroller"
          style={{
            background: bg1,
            maxHeight: "74vh",
            marginTop: "10px",
            right: "4vw",
            left: "4vw",
            boxShadow: "0 0 4px #4d4d4d",
          }}
        >
          <div
            className="d-flex gap-3 p-2 position-sticky top-0"
            style={{ background: bg1, zIndex: 1000 }}
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
                e.preventDefault();
                setIsTouched(false);
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
              {" "}
              Result for {query}
            </div>
          </div>
          <div className="d-flex flex-column gap-4 p-2">
            {Filterd_result?.map(
              (res, idx) =>
                admin_user?._id !== res?._id &&
                res && (
                  <div className="d-flex" key={res._id || idx}>
                    <Fragment>
                      <UserRing user={res} onlyphoto={false} />
                    </Fragment>
                    <FollowBtn
                      user={res}
                      cls="btn btn-outline-primary p-0 h-100 ps-3 rounded-0 pe-3 p-1"
                    />
                  </div>
                )
            )}
          </div>

          <div className="d-flex flex-column gap-4 p-2 position-relative">
            {Filterd_posts?.map((res, idx) => (
              <div
                className="d-flex flex-column"
                key={`F-post${res._id || idx}`}
                style={{
                  color: text_clrM,
                }}
              >
                <div className="d-flex gap-3 align-items-start">
                  <div className="mt-">
                    <UserRing
                      user={all_user?.filter((u) => u._id == res?.userId)[0]}
                      onlyphoto={true}
                      style={{}}
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
                    {res.text}
                  </small>
                  <div
                    className=""
                    onClick={() => {
                      setopenSlidWin(false);
                      setQuery("");
                      nevigate(`/home/${res._id}`);
                    }}
                  >
                    <CardPost
                      post={res}
                      style={{
                        width: "84px",
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
