import { Fragment, useEffect, useState } from "react";
import { useQuote } from "../src/context/QueotrContext";
import { UserRing } from "../src/maincomponents/EachPost";
import { FollowBtn } from "../src/maincomponents/EachPost";
import { CardPost } from "../src/maincomponents/Home";
import { useNavigate } from "react-router-dom";
import { Loading } from "./LazyLoading";
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

  return (
    <>
      <div className="">
        <form onSubmit={handleSearch} className="input-group">
          <input
            type="text"
            className="form-control rounded-0"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
        <div>
          {Filterd_result?.map(
            (res, idx) =>
              admin_user?._id !== res?._id &&
              res && (
                <div className="d-flex mt-3" key={res._id || idx}>
                  <UserRing user={res} />
                  <FollowBtn
                    user={res}
                    cls="btn btn-outline-primary p-0 h-100 ps-3 rounded-0 pe-3 p-1"
                  />
                </div>
              )
          )}
        </div>

        <div>
          {Filterd_posts?.map((res, idx) => (
            <div
              className="d-flex mt-3 flex-column border"
              key={`F-post${res._id || idx}`}
            >
              <div className="d-flex justify-cpntent-between">
                <p className="flex-grow-1 w-100 p-2">{res.text}</p>
                <div
                  className=""
                  onClick={() => {
                    nevigate(`/home?postId=${res._id}`);
                  }}
                >
                  <CardPost
                    post={res}
                    style={{
                      height: "80px",
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
