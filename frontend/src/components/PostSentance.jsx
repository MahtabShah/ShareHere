import React, { useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const PostSentence = ({ fetchSentences }) => {
  const [text, setText] = useState("");
  const [Errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // console.log("token......at line 10: frontend", token);

    try {
      const res = await axios.post(
        `${API}/api/sentence/post`,
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
      <div className="d-flex flex-column">
        <h4>Post a Sentence</h4>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="form-control rounded-0 shadow-none"
          placeholder="Write your sentence here..."
        />
        {Errors && <small className="text-danger">{Errors}</small>}
        <br />
        <button
          type="submit"
          className="btn btn-outline-danger ps-5 pe-5 rounded-0"
          style={{ alignSelf: "end" }}
        >
          Post
        </button>
      </div>
    </form>
  );
};

export default PostSentence;
