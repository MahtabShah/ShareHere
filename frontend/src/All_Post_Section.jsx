import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useMemo } from "react";
import "./App.css";
import { useQuote } from "./context/QueotrContext";
import { EachPost } from "./maincomponents/EachPost";
import { throttle } from "lodash";
import {
  SuggetionSlipInPost,
  GalleryPost,
} from "./maincomponents/NewUserUpdate";
import { usePost, Rank_Calculation } from "./context/PostContext";
import socket from "./maincomponents/socket";

function All_Post_Section({ category, loading }) {
  const [rn, setRn] = useState(null);

  const { all_user, openSlidWin, setActiveIndex } = useQuote();

  const { limit, page, fetch_n_posts, setPosts, setCameSet, cameSet } =
    usePost();

  var { posts } = usePost();

  useEffect(() => {
    const handleScroll = throttle(async () => {
      // setLoading(true);
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        const data = await fetch_n_posts(limit, page, category);
        // console.log("Fetching page:", page, data);

        if (data?.length > 0) {
          const sorted = data
            .map((post) => ({
              ...post,
              rank: Rank_Calculation(post),
            }))
            .sort((a, b) => b.rank - a.rank);

          setPosts((prev) => [...prev, ...sorted]);
        }
      }
    }, 500);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);

  const visible_post = useMemo(() => {
    if (!posts || !all_user) return [];

    // make posts unique by _id
    const uniquePosts = Array.from(
      new Map(posts.map((p) => [p._id, p])).values()
    );

    return uniquePosts.map((post) => {
      const user = all_user.find((u) => u?._id === post.userId);
      return { post, user };
    });
  }, [posts, all_user]);

  useEffect(() => {
    setRn(Math.floor(Math.random() * 10 + 1));
  }, [category]);

  useEffect(() => {
    if (!openSlidWin) {
      setActiveIndex("Home");
    }
  }, [openSlidWin]);
  // useEffect(() => {
  //   // "deletedPost" event listen karna
  //   socket.on("deletedPost", (id) => {
  //     console.log("Post deleted with id:", id);

  //     // State ko update karna using setVisiblePost
  //     // setVisiblePost((prevPosts) =>
  //     //   prevPosts.filter(({ post }) => post._id !== id)
  //     // );
  //   });

  //   // Cleanup on unmount
  //   return () => {
  //     socket.off("deletedPost");
  //   };
  // }, [socket]);

  return loading ? (
    <>
      <div
        className="p-4 fw-bold rounded bg-danger text-light"
        style={{ border: "3px solid #f00" }}
      >
        ⚠️ Kindly Note <br />
        The site may take a few minutes to load, as free hosting services
        occasionally pause inactive applications.
      </div>
    </>
  ) : (
    visible_post.map(
      ({ post, user }, idx) =>
        user &&
        post && (
          <div
            key={`comment-${idx}`}
            id={post?._id}
            className="d-flex flex-column"
          >
            {rn && rn + 4 > idx && idx > rn + 2 ? (
              <GalleryPost category={category} />
            ) : (
              <EachPost user={user} comment={post} />
            )}

            {rn && rn + 1 > idx && idx > rn - 1 && (
              <div
                className="mt-4 mb-3 p-1 rounded-3 d-flex gap-4 none-scroller overflow-x-auto "
                style={{ maxWidth: "100%" }}
              >
                <SuggetionSlipInPost />
              </div>
            )}
          </div>
        )
    )
  );
}

export default All_Post_Section;
