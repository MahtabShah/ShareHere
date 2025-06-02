import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loading } from "../../TinyComponent/LazyLoading";
import PreImages from "../../TinyComponent/PreImages";
import Carousel from "react-bootstrap/Carousel";
import Nav from "react-bootstrap/Nav";

const API = import.meta.env.VITE_API_URL;

const pre_images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
];

const pre_bg_color = [
  "#000",
  "#23d",
  "#0d0",
  "#0dd",
  "#00d",
  "#dff",
  "#df2",
  "#cd2",
  "#a27",
  "#8ae",
  "#098",
  "#345",
  "#456",
  "#d00",
];

const PostSentence = ({ fetchSentences, all_user, admin }) => {
  const [text, setText] = useState("");
  const [image_text, setimage_Text] = useState("");
  const [Errors, setErrors] = useState("");
  const [images, setImages] = useState([]);
  const [pages, setPages] = useState([]);
  const [Pre_Image, setPre_Image] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [LazyLoading, setLazyLoading] = useState(false);
  const [isPre_Image, setisPre_Image] = useState(false);
  const textareaRef = useRef(null);
  const [bg_clr, setbg_clr] = useState("#dff");
  const [vibes, setVibes] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [curr_user, setcurr_user] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const token = localStorage.getItem("token");

  const handleInput = (idx, e, key) => {
    if (key === "text") {
      setText(e.target.value);
    } else if (key === "image_text") {
      setimage_Text(e.target.value);
      const updated = [...vibes];
      updated[idx] = e.target.value;
      setVibes(updated);
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("You can't upload more than 5 images.");
      return;
    }

    const fileURLs = files.map((file) => ({
      type: "img",
      val: URL.createObjectURL(file),
    }));
    const fileData = files.map((file) => ({ type: "img", val: file }));

    setImages((prev) => [...prev, ...fileURLs]);
    setPages((prev) => [...prev, ...fileData]);
    setImagePreviews((prev) => [...prev, ...files]);
  };

  const handlePreImage = (img, idx) => {
    const alreadySelected = images.some((i) => i.val === img.val);

    if (alreadySelected) {
      setImages(images.filter((i) => i.val !== img.val));
      setPre_Image(Pre_Image.filter((i) => i.val !== img.val));
    } else {
      const newImage = { type: "img", val: img };
      setImages([newImage, ...images]);
      setPre_Image([newImage, ...Pre_Image]);
    }

    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", text);
    formData.append("image_text", image_text);

    pages.forEach((page, idx) => {
      if (page.type === "img") {
        formData.append("images", page.val);
      }
      formData.append(
        "pages_meta",
        JSON.stringify({
          type: page.type,
          text: page.text,
          vibe: vibes[idx],
          val: page.type === "img" ? null : page.val,
        })
      );
    });

    setLazyLoading(true);
    try {
      const res = await axios.post(`${API}/api/sentence/post`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSentences();
      setText("");
      setimage_Text("");
      setImages([]);
      setPages([]);
      setImagePreviews([]);
      setSelectedIndices([]);
      setVibes([]);
    } catch (err) {
      alert(
        "Failed to save sentence: " +
          (err.response?.data?.message || err.message)
      );
      setErrors(err.response?.data?.message || err.message);
      console.error("Error saving sentence", err);
    }
    setLazyLoading(false);
  };

  useEffect(() => {
    if (pages.length) setCarouselIndex(pages.length - 1);
  }, [pages]);

  const handleSelect = (selectedIndex, e) => {
    setActiveIndex(selectedIndex);
  };

  const removeCurrentSlide = () => {
    if (pages.length === 0) return;

    const newPages = pages.filter((_, index) => index !== activeIndex);
    const newImages = images.filter((_, index) => index !== activeIndex);

    setPages(newPages);
    setImages(newImages);

    // Update activeIndex to avoid out-of-bounds
    setActiveIndex((prev) =>
      activeIndex >= newPages.length ? newPages.length - 1 : prev
    );
  };

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
            <div
              className="d-flex rounded-3 m-3 mt-2 border"
              style={{
                width: "calc(100% - 2rem)",
                maxWidth: "600px",
                aspectRatio: "17/15",
                background: `${bg_clr}`,
              }}
            >
              <Carousel
                className="w-100"
                interval={null}
                activeIndex={activeIndex}
                onSelect={handleSelect}
              >
                {images.map((page, idx) => (
                  <Carousel.Item className="">
                    <div
                      key={idx}
                      className="rounded-3"
                      style={{
                        // width: "calc(100% - 2rem)",
                        maxWidth: "600px",
                        aspectRatio: "17/15",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        className="w-100 h-100 bg-image p-3"
                        style={{
                          background:
                            page.type === "img" ? `url(${page.val})` : page.val,
                        }}
                      />

                      <textarea
                        name="image_text"
                        id="image_text"
                        className="position-absolute border-0 w-100 h-100 text-light p-4"
                        style={{
                          top: "0",
                          left: "0",
                          background: "#3330",
                          caretColor: "red",
                        }}
                        value={vibes[idx] || ""}
                        onChange={(e) => {
                          handleInput(idx, e, "image_text");
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

            <div className="d-flex gap-1 align-items-center justify-content-center">
              <span
                className="bold fs-4 border pb-1 bg-light rounded-5 d-flex   align-items-center justify-content-center"
                style={{
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setPages(() => [...pages, { type: "bg-clr", val: bg_clr }]);
                  setImages(() => [...images, { type: "bg-clr", val: bg_clr }]);
                }}

                // onClick={() => {
                //   const newColor =
                //     "#" + Math.floor(Math.random() * 16777215).toString(16);
                //   setPages((prev) => [
                //     ...prev,
                //     { type: "bg-clr", val: newColor },
                //   ]);
                //   setImages((prev) => [
                //     ...prev,
                //     { type: "bg-clr", val: newColor },
                //   ]);
                // }}
              >
                +
              </span>
              <span
                className=" bold fs-4 border pb-1 bg-light rounded-5 d-flex  align-items-center justify-content-center"
                style={{
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
                onClick={removeCurrentSlide}
              >
                -
              </span>
            </div>
          </div>
          {/* above select image area */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              handleInput(0, e, "text");
            }}
            required
            className={`form-control rounded-0 shadow-none ps-3 pe-5 ${
              images.length > 0 ? " border-0 border-top" : "border border-top-0"
            }`}
            placeholder="Write about post here . . ."
            style={{ overflow: "hidden", resize: "none" }}
            spellCheck="false"
          />

          {Errors && <small className="text-danger">{Errors}</small>}
          <br />

          {/* {browsssss imggggg} */}
          <div className="d-flex gap-3 justify-content-end p-0 m-0">
            {/* {isPre_Image} */}
            {!true ? (
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

      <div className="d-flex flex-wrap border p-3 mt-2 gap-2 w-100">
        {pre_bg_color.map((c, idx) => {
          return (
            <>
              <span
                key={`bg-${idx}`}
                className="rounded-5"
                style={{
                  minWidth: "32px",
                  minHeight: "32px",
                  background: `${c}`,
                  cursor: "pointer",
                  border: `${
                    bg_clr === c ? "2px solid red" : "2px solid #f9d8df00"
                  }`,
                }}
                onClick={() => {
                  setbg_clr(c);
                  setPages((prev) =>
                    prev.map((item, idx) =>
                      idx === activeIndex && item.type === "bg-clr"
                        ? { ...item, val: c }
                        : item
                    )
                  );

                  setImages((prev) =>
                    prev.map((item, idx) =>
                      idx === activeIndex && item.type === "bg-clr"
                        ? { ...item, val: c }
                        : item
                    )
                  );
                }}
              />
            </>
          );
        })}
      </div>

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
