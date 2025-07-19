import { Fragment, useEffect, useState } from "react";
import { useQuote } from "../src/context/QueotrContext";
import { UserRing } from "../src/maincomponents/EachPost";
import { FollowBtn } from "../src/maincomponents/EachPost";
import { CardPost } from "../src/maincomponents/Home";
import { useNavigate } from "react-router-dom";
import { Loading } from "./LazyLoading";
import { useTheme } from "../src/context/Theme";

export const SearchBaar = () => {
  const [query, setQuery] = useState("");
  const [Filterd_result, setFilterd_result] = useState([]);
  const [Filterd_posts, setFilterd_posts] = useState([]);
  const { all_user, all_posts, admin_user } = useQuote();
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

  useEffect(() => {
    const f_res = filter_posts(all_posts, query);
    setFilterd_posts(f_res);
  }, [query]);
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

  const { text_clrH, text_clrL, text_clrM, mainbg } = useTheme();

  return (
    <>
      <div
        className="position-relative h-100 search-bar"
        style={{ background: mainbg, zIndex: 1000 }}
      >
        <form
          onSubmit={handleSearch}
          className="input-group rounded-5"
          style={{ border: `1px solid ${text_clrL}` }}
        >
          <input
            type="text"
            className="form-control border-0 rounded-5"
            placeholder="Search..."
            value={query}
            style={{
              background: mainbg,
              color: text_clrM,
            }}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="btn border-0"
            style={{ color: text_clrM }}
            type="submit"
          >
            Search
          </button>
        </form>
        <div className="d-flex flex-column gap-4 mt-3">
          {Filterd_result?.map(
            (res, idx) =>
              admin_user?._id !== res?._id &&
              res && (
                <div className="d-flex" key={res._id || idx}>
                  <UserRing user={res} onlyphoto={false} />
                  <FollowBtn
                    user={res}
                    cls="btn btn-outline-primary p-0 h-100 ps-3 rounded-0 pe-3 p-1"
                  />
                </div>
              )
          )}
        </div>

        <div className="d-flex flex-column gap-3 mt-4">
          {Filterd_posts?.map((res, idx) => (
            <div
              className="d-flex flex-column"
              key={`F-post${res._id || idx}`}
              style={{
                color: text_clrM,
              }}
            >
              <div className="d-flex gap-3 mt-2 align-items-start">
                <div className="mt-">
                  <UserRing
                    user={all_user?.filter((u) => u._id == res?.userId)[0]}
                    onlyphoto={true}
                    style={{}}
                  />
                </div>
                <p className="flex-grow-1 w-100 ">{res.text}</p>
                <div
                  className=""
                  onClick={() => {
                    nevigate(`/home?postId=${res._id}`);
                  }}
                >
                  <CardPost
                    post={res}
                    style={{
                      height: "84px",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="ms-2 d-flex gap-3 overflow-x-auto none-scroller">
        {trend.map((t, idx) => (
          <div key={`idx-trend-${idx}`}>
            <button
              className="btn btn-outline-dark rounded-0"
              style={{ minWidth: "max-content" }}
            >
              {t}
            </button>
          </div>
        ))}
      </div> */}
    </>
  );
};
