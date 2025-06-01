import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loading } from "../../TinyComponent/LazyLoading";
import { use } from "react";
import PreImages from "../../TinyComponent/PreImages";
import Carousel from "react-bootstrap/Carousel";
import Nav from "react-bootstrap/Nav";
const API = import.meta.env.VITE_API_URL;

const pre_images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // Sunset Over Mountains
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // Calm Beach Scene
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470", // Forest Pathway
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6", // Sunflower Field
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df", // Vintage Paper Texture
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", // Starry Night Sky
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", // Mountain Peak Sunrise
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29", // Colorful Ink in Water
];

const PostSentence = ({ fetchSentences, all_user, admin }) => {
  const [text, setText] = useState("");
  const [image_text, setimage_Text] = useState("");
  const [Errors, setErrors] = useState("");
  const [images, setImages] = useState([]);
  const [Pre_Image, setPre_Image] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // for showing thumbnails
  const [LazyLoading, setLazyLoading] = useState(false); // to track which button is animating
  const [isPre_Image, setisPre_Image] = useState(false);
  const textareaRef = useRef(null);

  const handleInput = (e, key) => {
    if (key === "text") {
      setText(e.target.value);
    } else if (key === "image_text") {
      setimage_Text(e.target.value);
    }
    const textarea = textareaRef.current;
    // textarea.style.height = "2px"; // Reset height
    textarea.style.height = textarea.scrollHeight + "px"; // Set to scroll height
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("You can't upload more than 5 images.");
      return;
    }

    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...newImageUrls, ...prev]); // used in this code
    setImagePreviews((prev) => [...files, ...prev]); // store File objects
  };
  const token = localStorage.getItem("token");
  const [selectedIndices, setSelectedIndices] = useState([]);

  const handlePreImage = (img, idx) => {
    // console.log("----> hamare dost ", selected_indx);

    const condition = images?.includes(img);

    if (condition) {
      const imgs = images.filter((im, idx) => im !== img);
      setImages(imgs);

      const pre_imgs = Pre_Image.filter((im, idx) => im !== img);

      setPre_Image((prev) => [...pre_imgs, ...prev]); // store File objects

      // console.log("----> 1;", images);
    } else {
      setImages((prev) => [img, ...prev]);
      setPre_Image((prev) => [img, ...prev]); // store File objects

      // console.log("----> 2;", selected_indx);
    }

    setSelectedIndices(
      (prev) =>
        prev.includes(idx)
          ? prev.filter((i) => i !== idx) // remove if already selected
          : [...prev, idx] // add if not selected
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", text);
    formData.append("image_text", image_text);

    // Append uploaded images (files)
    for (let img of imagePreviews) {
      formData.append("images", img);
    }

    // Append image URLs (Pre_Image) as array values
    Pre_Image.forEach((url, i) => {
      formData.append(`Pre_Image[${i}]`, url);
    });

    setLazyLoading(true);

    try {
      const res = await axios.post(`${API}/api/sentence/post`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchSentences();
      setText("");
      setimage_Text("");
      setImages([]);
      setImagePreviews([]);
      setSelectedIndices([]);
    } catch (err) {
      alert(
        "Failed to save sentence: " +
          (err.response?.data?.message || err.message)
      );
      setErrors(err.response?.data?.message || err.message);
      console.error("Error saving sentence: 67", err);
    }

    setLazyLoading(false);
  };

  const [curr_user, setcurr_user] = useState(null);

  console.log("admin---- ", admin);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="col-md-12 w-100"
        style={{ maxWidth: "600px" }}
      >
        <div className="d-flex flex-column">
          <div
            className="border position-relative rounded-0 border-bottom-0"
            style={{ right: 0, minHeight: "230px" }}
          >
            <div
              className="position-absolute bg-light rounded- pt-1 d-flex align-items-center"
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
                    backgroundColor: `${admin?.bg_clr}`,
                  }}
                >
                  {admin?.username?.charAt(0) || "M"}
                </div>
                <div>
                  <div style={{ fontWeight: "bold" }}>
                    @{admin?.username || "Mahtab"}
                  </div>
                  {/* <small style={{ color: "#888" }}>
                          Visibility: Public
                        </small> */}
                </div>
              </div>
            </div>
            <div className="d-flex rounded-3">
              <Carousel className="w-100">
                {images?.map((img, idx) => (
                  <Carousel.Item className="">
                    <div
                      key={idx}
                      className="rounded-3 m-3"
                      style={{
                        width: "calc(100% - 2rem)",
                        maxWidth: "600px",
                        aspectRatio: "17/15",
                        minHeight: "400px",
                        flexShrink: 0,
                      }}
                    >
                      {/* <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="h-100 w-100"
                        style={{ objectFit: "cover" }}
                      /> */}

                      <div
                        className="w-100 h-100 bg-image p-3"
                        style={{
                          background: `url(${img})`,
                        }}
                      />

                      <textarea
                        name="image_text"
                        id="image_text"
                        className="position-absolute border-0 w-100 h-100 p-4"
                        style={{
                          top: "0",
                          left: "0",
                          background: "#3330",
                          caretColor: "red",
                        }}
                        onChange={(e) => {
                          handleInput(e, "image_text");
                        }}
                        spellCheck="false"
                        placeholder="you can write a vibe ink here...."
                      />
                    </div>
                    {/* <Carousel.Caption>
                          <h3>First slide label</h3>
                        </Carousel.Caption> */}
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              handleInput(e, "text");
            }}
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
            {!isPre_Image ? (
              <div
                className="btn btn-outline-dark ps-3 pe-3 rounded-0 p-2"
                style={{ height: "42px" }}
                onClick={() => {
                  setisPre_Image(!isPre_Image);
                }}
              >
                Select Images
              </div>
            ) : (
              <label
                htmlFor="images"
                className="btn btn-outline-dark ps-3 pe-3 rounded-0 p-2"
                style={{ height: "42px" }}
              >
                Browse Image
              </label>
            )}
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

      {isPre_Image && (
        <div
          className="d-grid gap-3 pt-3 w-100"
          style={{
            gridTemplateColumns: "repeat(auto-fit , minmax(124px, 1fr)",
            maxWidth: "600px",
          }}
        >
          {pre_images?.map((img, idx) => (
            <div
              key={idx}
              onClick={() => handlePreImage(img, idx)}
              className="borde"
              style={{
                border: selectedIndices.includes(idx)
                  ? "2px solid #0d0"
                  : "2px solid #f9f8fa",
              }}
            >
              <PreImages img={img} idx={idx} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PostSentence;
