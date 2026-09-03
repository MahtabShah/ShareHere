import { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
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
  const [loading, setLoading] = useState(false);
  const [limit] = useState(8);
  const [Filterd_posts, setFilterd_posts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  const elementRef = useRef(null);
  const containerRef = useRef(null);

  // Safe user filter that handles undefined usernames, names, emails, and bios
  const filter_users = useCallback((usersList, searchStr) => {
    if (!searchStr || !Array.isArray(usersList)) return [];
    const q = searchStr.trim().toLowerCase();
    if (!q) return [];

    return usersList
      .filter((user) => {
        if (!user) return false;
        const username = (user.username || "").toLowerCase();
        const name = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        const bio = (user.bio || "").toLowerCase();
        return (
          username.includes(q) ||
          name.includes(q) ||
          email.includes(q) ||
          bio.includes(q)
        );
      })
      .sort((a, b) => {
        const nameA = (a?.username || a?.name || "").toLowerCase();
        const nameB = (b?.username || b?.name || "").toLowerCase();
        const indexA = nameA.indexOf(q);
        const indexB = nameB.indexOf(q);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
  }, []);

  // Fetch posts from backend with encoded query and append support
  const fetchPosts = async (searchQuery, pageNum = 1, append = false) => {
    const term = (searchQuery || "").trim();
    if (!term) {
      setFilterd_posts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/api/crud/search?search=${encodeURIComponent(term)}&page=${pageNum}&limit=${limit}`,
      );

      const data = res?.data?.posts || [];
      if (append) {
        setFilterd_posts((prev) => {
          const map = new Map();
          [...prev, ...data].forEach((p) => {
            if (p && p._id) map.set(p._id, p);
          });
          return Array.from(map.values());
        });
      } else {
        setFilterd_posts(data);
      }
      setHasMore(data.length >= limit);
    } catch (err) {
      console.error("Error fetching posts:", err);
      if (!append) {
        setFilterd_posts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sync users filter and debounce server posts search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setFilterd_result([]);
      setFilterd_posts([]);
      setLoading(false);
      return;
    }

    const matchedUsers = filter_users(all_user, trimmed);
    const uniqueUsers = Array.from(
      new Map(matchedUsers.map((u) => [u._id, u])).values(),
    );
    setFilterd_result(uniqueUsers);

    setLoading(true);
    const timer = setTimeout(() => {
      setPage(1);
      fetchPosts(trimmed, 1, false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, all_user, filter_users]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      const f_res = filter_users(all_user, trimmed);
      setFilterd_result(f_res);
      setPage(1);
      fetchPosts(trimmed, 1, false);
    }
  };

  const handleTouchOutside = (event) => {
    if (elementRef.current && !elementRef.current.contains(event.target)) {
      setIsTouched(false);
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

  const { textPrimary, textSecondary, textMuted, bgSurface, bgPage, bgSubtle, bgBorder } =
    useTheme();

  function handleScroll() {
    const div = containerRef.current;
    if (!div || loading || !hasMore) return;

    if (div.scrollTop + div.clientHeight >= div.scrollHeight - 50) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(query, nextPage, true);
    }
  }

  return (
    <div className="position-relative w-100" ref={elementRef}>
      <div className="p-0 m-0 h-100">
        <form onSubmit={handleSearch} className="position-relative d-flex align-items-center w-100">
          <span
            className="position-absolute start-0 ps-3 d-flex align-items-center"
            style={{
              color: textMuted,
              pointerEvents: "none",
              zIndex: 2,
            }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: "13px" }} />
          </span>
          <input
            type="text"
            className="form-control rounded-pill active_search"
            placeholder={mobile_break_point ? "Search vibes, users..." : "Search vibes, creators, tags..."}
            value={query}
            style={{
              background: bgSubtle || "rgba(0,0,0,0.03)",
              color: textPrimary,
              border: `1px solid ${bgBorder}`,
              paddingLeft: "36px",
              paddingRight: query.trim() ? "34px" : "14px",
              height: "36px",
              fontSize: "13.5px",
              boxShadow: "none",
              transition: "border-color 0.2s, background 0.2s",
              width: "100%",
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsTouched(true);
            }}
            onFocus={() => setIsTouched(true)}
          />
          {query.trim() && (
            <button
              type="button"
              className="btn p-0 position-absolute end-0 pe-3 d-flex align-items-center border-0 shadow-none"
              onClick={() => {
                setQuery("");
                setFilterd_posts([]);
                setFilterd_result([]);
                setLoading(false);
              }}
              title="Clear search"
              style={{
                background: "transparent",
                color: textMuted,
                cursor: "pointer",
                zIndex: 2,
              }}>
              <FontAwesomeIcon icon={faXmark} style={{ fontSize: "13px" }} />
            </button>
          )}
        </form>
      </div>

      {/* Mobile search backdrop */}
      {query.trim() && isTouched && mobile_break_point && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(0, 0, 0, 0.35)",
            zIndex: 99990,
          }}
          onClick={() => setIsTouched(false)}
        />
      )}

      {query.trim() && isTouched && (
        <div
          className="overflow-auto none-scroller"
          style={{
            background: bgSurface,
            border: `1px solid ${bgBorder}`,
            borderRadius: "14px",
            boxShadow: "0 10px 32px rgba(0, 0, 0, 0.22)",
            zIndex: 99999,
            overflowY: "auto",
            ...(mobile_break_point
              ? {
                  position: "fixed",
                  top: "56px",
                  left: "10px",
                  right: "10px",
                  width: "auto",
                  maxHeight: "calc(100dvh - 120px)",
                }
              : {
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: "0",
                  right: "0",
                  width: "100%",
                  maxHeight: "75vh",
                }),
          }}
          ref={containerRef}
          onScroll={handleScroll}>
          <div
            className="d-flex align-items-center justify-content-between p-3 position-sticky top-0"
            style={{
              background: bgSurface,
              borderBottom: `1px solid ${bgBorder}`,
              zIndex: 3,
            }}>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold" style={{ color: textPrimary, fontSize: "14px" }}>
                Results for &ldquo;{query}&rdquo;
              </span>
            </div>
            <button
              type="button"
              className="btn btn-sm p-1 border-0"
              style={{ color: textMuted }}
              onClick={() => setIsTouched(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* User / Creator results */}
          {Filterd_result?.length > 0 && (
            <div className="d-flex flex-column gap-1 p-2">
              <div
                className="text-muted fw-semibold text-uppercase px-2 pt-1 pb-1"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                Creators ({Filterd_result.length})
              </div>
              {Filterd_result.map((res, idx) => {
                if (!res) return null;
                const isCurrentAdmin = admin_user?._id === res?._id;
                return (
                  <div
                    className="d-flex align-items-center justify-content-between p-2 rounded-3"
                    key={res._id || `usr-${idx}`}
                    style={{
                      background: bgSurface,
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = bgSubtle || "rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = bgSurface;
                    }}
                    onClick={() => {
                      setIsTouched(false);
                      setQuery("");
                      if (res?._id) {
                        nevigate(`/api/user/${res._id}`);
                      }
                    }}>
                    <div className="flex-grow-1 overflow-hidden me-2">
                      <UserRing user={res} onlyphoto={false} dm={40} />
                    </div>
                    {!isCurrentAdmin && (
                      <div
                        style={{ minWidth: "84px", flexShrink: 0 }}
                        onClick={(e) => e.stopPropagation()}>
                        <FollowBtn
                          id={res?._id}
                          cls="btn btn-sm btn-outline-primary w-100 py-1 px-2 rounded-pill"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Post results */}
          {Filterd_posts?.length > 0 && (
            <div className="d-flex flex-column gap-1 p-2 border-top" style={{ borderColor: bgBorder }}>
              <div
                className="text-muted fw-semibold text-uppercase px-2 pt-1 pb-1"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                Vibes & Posts ({Filterd_posts.length})
              </div>
              {Filterd_posts.map((res, idx) => {
                if (!res) return null;
                const postUser =
                  (all_user && all_user.find((u) => u?._id === (res?.userId?._id || res?.userId))) ||
                  (res?.userId && typeof res.userId === "object" ? res.userId : null);

                return (
                  <div
                    className="d-flex gap-3 align-items-center p-2 rounded-3"
                    key={`F-post-${res._id || idx}`}
                    style={{
                      color: textSecondary,
                      background: bgSurface,
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = bgSubtle || "rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = bgSurface;
                    }}
                    onClick={() => {
                      setopenSlidWin(false);
                      setIsTouched(false);
                      setQuery("");
                      nevigate(`/home/${res._id}`);
                    }}>
                    <div onClick={(e) => e.stopPropagation()}>
                      <UserRing
                        user={postUser}
                        onlyphoto={true}
                        dm={40}
                      />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="small fw-semibold mb-1" style={{ color: textPrimary }}>
                        @{postUser?.username || postUser?.name || "creator"}
                      </div>
                      <small
                        className="d-block text-truncate fw-normal"
                        style={{
                          color: textSecondary,
                          lineHeight: "1.3",
                        }}>
                        {res.text || res.image_text || "View Vibe"}
                      </small>
                    </div>
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        flexShrink: 0,
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: `1px solid ${bgBorder}`,
                      }}>
                      <CardPost
                        post={res}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="d-flex justify-content-center py-3">
              <Loading dm={28} />
            </div>
          )}

          {/* Empty state */}
          {!loading && !Filterd_result.length && !Filterd_posts.length && (
            <div className="text-center py-4 px-3" style={{ color: textMuted }}>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="mb-2 fs-4 opacity-50" />
              <p className="mb-0 small">No creators or vibes matching &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
