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
  const [isData, setIsdata] = useState("");
  const limit = 10;

  // Fetch posts but do NOT change page here
  const fetch_n_posts = async (l, p, c) => {
    setPost_loading(true);
    try {
      const res = await axios.get(
        `${API}/api/auth/all_sentence?limit=${l}&page=${p}&category=${c}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status !== 200) {
        throw new Error("Failed to fetch posts");
      }
      if (res?.data?.length > 0) {
        setPage(() => p + 1);
      }

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

  const fetch_user_by_Id = async (id) => {
    try {
      if (id) {
        const res = await axios.get(`${API}/api/crud/get_userbyId/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.length !== 0) {
          return res.data;
        }
      }
    } catch (err) {
      console.log("Failed to fetch admin see err in console 34 context", err);
    }
  };

  const fetch_post_by_Id = async (id) => {
    try {
      if (id) {
        const res = await axios.get(`${API}/api/crud/post_id/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.length !== 0) {
          return res.data;
        }
      }
    } catch (err) {
      console.log("Failed to fetch admin see err in console 34 context", err);
    }
  };

  // Initial loa

  useEffect(() => {
    const handleSentence = (data) => {
      // console.log("Received new sentence:", data);
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
        page,
        post_loading,
        setPost_loading,
        setPosts,
        setPage,
        fetch_n_posts,
        limit,
        fetch_posts_by_user,
        fetch_comments_postId,
        fetch_user_by_Id,
        fetch_post_by_Id,
        isData,
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
  const ageInHours = now.diff(createdAt, "hour") || 1; // prevent divide by 0
  const likes = post?.likes?.length || 0;
  const comments = post?.comments?.length || 0;
  const views = post?.views || 1;
  const followers = post?.followers?.length || 1;
  const following = post?.following?.length || 1;
  // const isFollowed = post?.followers?.includes(u=>u._id == admin_user?._id) || 1;

  // Engagement Score
  const recencyFactor = 6000 / ageInHours; // decay over 1 day

  const engagement = views + recencyFactor + likes * 8 + comments * 24; // comment > like

  // Network influence
  const influence = Math.log10(followers + 2) / Math.log10(following + 2); // avoid division explosion

  // Recency Bonus: newer posts get higher weight

  // Final rank formula (tunable)
  const rank = engagement * influence + (Math.random() * 1000 + 1);

  // console.log("ageInHours", rank, views);

  return Math.round(rank); // round to 2 decimal places
}
