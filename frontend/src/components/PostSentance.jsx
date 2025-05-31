import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loading } from "../../TinyComponent/LazyLoading";
import { use } from "react";

const API = import.meta.env.VITE_API_URL;

const PostSentence = ({ fetchSentences, all_user }) => {
  const [text, setText] = useState("");
  const [Errors, setErrors] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // for showing thumbnails
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating

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

    setImagePreviews((prev) => [...prev, ...files]); // store File objects
  };
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("token......at line 10: frontend", token);

    const formData = new FormData();
    formData.append("text", text);
    console.log("form dat ===> 1 ", formData);

    for (let img of imagePreviews) {
      formData.append("images", img); // repeat key name for multiple files
    }

    setLazyLoading(true);
    console.log("form dat ===> ", formData, images, text);
    try {
      const res = await axios.post(`${API}/api/sentence/post`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // alert("Sentence saved: " + res.data.sentence.text);
      fetchSentences();
      setText("");
      setImages([]);
    } catch (err) {
      alert(
        "Failed to save sentence: " +
          (err.response?.data?.message || err.message)
      );

      // console.error("Error saving sentence:", err);

      setErrors(err.response?.data?.message || err.message);
    }

    setLazyLoading(!true);
  };

  const [curr_user, setcurr_user] = useState(null);

  // useEffect(() => {
  //   const token = localStorage.getItem("token"); // ya jahan se token milta ho

  //   const decodeJWT = () => {
  //     if (!token) return null;

  //     const payload = token.split(".")[1];
  //     const decodedPayload = atob(payload); // base64 decode
  //     return JSON.parse(decodedPayload);
  //   };

  //   const userData = decodeJWT(); // ✅ call the function
  //   setcurr_user(userData); // ✅ now set it
  //   const current_user = all_user?.find((u) => u._id === curr_user.id);
  //   setcurr_user(current_user);
  //   console.log("userDate,,,,,", userData, current_user);
  // }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex flex-column pt-2">
        <h4>Post a Vibe Ink Here :)</h4>

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
                {curr_user?.username?.charAt(0) || "M"}
              </div>
              <div>
                <div style={{ fontWeight: "bold" }}>
                  @{curr_user?.username || "Mahtab"}
                </div>
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
                  width: "600px",
                  aspectRatio: "17/11",
                  maxWidth: "92%",
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
          className={`form-control rounded-0 shadow-none ps-3 ${
            images.length > 0 ? " border-0 border-top" : "border border-top-0"
          }`}
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
            className="btn btn-outline-danger flex-grow-1 ps-5 pe-5 rounded-0"
            style={{ height: "42px" }}
          >
            {LazyLoading ? <Loading clr={"white"} /> : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostSentence;
