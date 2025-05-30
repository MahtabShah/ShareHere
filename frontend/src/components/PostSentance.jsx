import React, { useState } from "react";
import axios from "axios";

const PostSentence = ({ fetchSentences }) => {
  const [text, setText] = useState("");
  const [Errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // console.log("token......at line 10: frontend", token);

    try {
      const res = await axios.post(
        "https://sharehere-2ykp.onrender.com/api/sentence/post",
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // alert("Sentence saved: " + res.data.sentence.text);
      fetchSentences();
      setText("");
    } catch (err) {
      alert(
        "Failed to save sentence: " +
          (err.response?.data?.message || err.message)
      );

      // console.error("Error saving sentence:", err);

      setErrors(err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Post a Sentence</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className="form-control"
        placeholder="Write your sentence here..."
      />
      {Errors && <small className="text-danger">{Errors}</small>}
      <br />
      <button
        type="submit"
        className="btn btn-outline-danger ps-5 pe-5 rounded-0"
      >
        Post
      </button>
    </form>
  );
};

export default PostSentence;
