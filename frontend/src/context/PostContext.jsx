import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import socket from "../maincomponents/socket";

dayjs.extend(relativeTime);

const PostContext = createContext();
const API = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export const usePost = () => useContext(PostContext) || {};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [post_loading, setPost_loading] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 10;

  // Fetch posts but do NOT change page here
  const fetch_n_posts = async (l, p) => {
    setPost_loading(true);
    try {
      const res = await axios.get(
        `${API}/api/auth/all_sentence?limit=${l}&page=${p}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status !== 200) throw new Error("Failed to fetch posts");

      return res.data;
    } catch (err) {
      console.error("Failed to fetch your sentences", err);
      return [];
    } finally {
      setPost_loading(false);
    }
  };

  const fetch_posts_by_user = async (userId) => {
    try {
      const res = await axios.get(`${API}/api/auth/all_post/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // If your route is protected
        },
      });

      return res.data; // This will be the array of posts
    } catch (error) {
      console.error("Error fetching posts by user:", error);
      return [];
    }
  };

  const fetch_comments_postId = async (postId) => {
    try {
      const res = await axios.get(`${API}/api/crud/comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // If your route is protected
        },
      });

      return res.data; // This will be the array of posts
    } catch (error) {
      console.error("Error fetching posts by user:", error);
      return [];
    }
  };

  // Initial load
  useEffect(() => {
    fetch_n_posts(limit, 0).then((data) => {
      if (data?.length > 0) {
        const sorted = data
          .map((post) => ({
            ...post,
            rank: Rank_Calculation(post),
          }))
          .sort((a, b) => b.rank - a.rank);

        setPosts(sorted);
        setPage((prev) => prev + 1); // after first load
      }
    });
  }, []);

  useEffect(() => {
    const handleSentence = (data) => {
      console.log("Received new sentence:", data);
      // You can update state here
      setPosts((prev) => {
        const index = prev.findIndex((post) => post._id === data._id);

        if (index !== -1) {
          // Replace the post at the same index
          const updated = [...prev];
          updated[index] = data;
          return updated;
        }

        // If not found, add it to the start
        return [data, ...prev];
      });
    };

    socket.on("sentence", handleSentence);

    return () => {
      socket.off("sentence"); // cleanup on unmount
    };
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        post_loading,
        setPost_loading,
        page,
        setPosts,
        setPage,
        fetch_n_posts,
        limit,
        fetch_posts_by_user,
        fetch_comments_postId,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export function Rank_Calculation(post) {
  if (!post) return 0;

  const now = dayjs();
  const createdAt = dayjs(post?.createdAt);
  const ageInHours = now.diff(createdAt, "minute") || 1; // prevent divide by 0

  const likes = post?.likes?.length || 0;
  const comments = post?.comments?.length || 0;
  const views = post?.views || 1;
  const followers = post?.followers?.length || 1;
  const following = post?.following?.length || 1;
  // const isFollowed = post?.followers?.includes(u=>u._id == admin_user?._id) || 1;

  // Engagement Score
  const engagement = likes * 3 + comments * 7; // comment > like

  // Network influence
  const influence = Math.log10(followers + 2) / Math.log10(following + 2); // avoid division explosion

  // Recency Bonus: newer posts get higher weight
  const recencyFactor = 3600 / ageInHours; // decay over 1 day

  // Final rank formula (tunable)
  const rank = engagement * recencyFactor * influence;

  return Math.round(rank * (Math.random() * 100 + 1) * 100) / 100; // round to 2 decimal places
}
