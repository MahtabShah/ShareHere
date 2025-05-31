import React, { useState, useRef } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const PostSentence = ({ fetchSentences }) => {
  const [text, setText] = useState("");
  const [Errors, setErrors] = useState("");

  const [images, setImages] = useState([]);

  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setText(e.target.value);
    const textarea = textareaRef.current;
    // textarea.style.height = "2px"; // Reset height
    textarea.style.height = textarea.scrollHeight + "px"; // Set to scroll height
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert("You can't upload more than 10 images.");
      return;
    }

    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImageUrls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // console.log("token......at line 10: frontend", token);

    const formData = new FormData();
    formData.append("text", text);
    for (let img of images) {
      formData.append("images", img); // repeat key name for multiple files
    }

    try {
      const res = await axios.post(`${API}/api/sentence/post`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        <h4>Post a Vibe Ink Here - - - :)</h4>

        <div
          className="border position-relative rounded-0 border-bottom-0"
          style={{ right: 0, minHeight: "230px" }}
        >
          <div
            className="border position-absolute bg-light rounded- pt-1 d-flex align-items-center"
            style={{ right: "0" }}
          >
            <input
              type="file"
              name="images"
              id="images"
              className="form-control d-none border-0"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex gap-2 align-items-center  p-3 pb-0 pt-2">
              <div
                className="d-flex fw-semibold text-white rounded-5 align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#d63384",
                }}
              >
                M
              </div>
              <div>
                <div style={{ fontWeight: "bold" }}>Mahtāb Shah</div>
                {/* <small style={{ color: "#888" }}>
                          Visibility: Public
                        </small> */}
              </div>
            </div>
          </div>
          <div className="d-flex rounded-3" style={{ overflowX: "auto" }}>
            {images.map((img, idx) => (
              <div
                key={idx}
                className="border overflow-hidden rounded-3 m-3"
                style={{
                  height: "440px",
                  width: "600px",
                  maxWidth: "94%",
                  flexShrink: 0,
                }}
              >
                <img
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className="h-100 w-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          required
          className="form-control rounded-0 shadow-none border-top-0 ps-3"
          placeholder="Write your sentence here..."
          style={{ overflow: "hidden", resize: "none" }}
          spellCheck="false"
        />
        {Errors && <small className="text-danger">{Errors}</small>}
        <br />

        <div className="d-flex gap-3 justify-content-end p-0 m-0">
          <label
            htmlFor="images"
            className="btn btn-outline-dark ps-3 pe-3 rounded-0 p-2"
            style={{ height: "42px" }}
          >
            Select Images
          </label>

          <button
            type="submit"
            className="btn btn-outline-danger ps-5 pe-5 rounded-0"
            style={{ height: "42px" }}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostSentence;
