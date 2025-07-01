import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loading } from "../../TinyComponent/LazyLoading";
import PreImages from "../../TinyComponent/PreImages";
import { useQuote } from "../context/QueotrContext";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
import { Accordion } from "react-bootstrap";

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
  // 🌇 LINEAR GRADIENTS
  "linear-gradient(to right, #ff7e5f, #feb47b)", // Sunset
  "linear-gradient(to right, #4facfe, #00f2fe)", // Sky blue
  "linear-gradient(to right, #43e97b, #38f9d7)", // Green mint
  "linear-gradient(to right, #f7971e, #ffd200)", // Orange yellow
  "linear-gradient(to right, #c33764, #1d2671)", // Purple blue
  "linear-gradient(45deg, #ff9a9e, #fad0c4)", // Diagonal pink
  "linear-gradient(to top, #a18cd1, #fbc2eb)", // Lavender pink
  "linear-gradient(to right, #e0c3fc, #8ec5fc)", // Soft purple-blue
  "linear-gradient(to right, #ffecd2, #fcb69f)", // Warm peach
  "linear-gradient(to right, #ff8177, #ff867a, #ff8c7f)", // Pink burst
  "linear-gradient(to right, #00c3ff, #ffff1c)", // Blue to yellow
  "linear-gradient(to right, #00f260, #0575e6)", // Green to blue
  "linear-gradient(to right, #fc00ff, #00dbde)", // Violet to aqua
  "linear-gradient(to right, #e1eec3, #f05053)", // Soft green red
  "linear-gradient(to right, #74ebd5, #9face6)", // Light sea
  "linear-gradient(to right, #ff6a00, #ee0979)", // Fire vibes
  "linear-gradient(to right, #fdfc47, #24fe41)", // Lime sun
  "linear-gradient(to right, #12c2e9, #c471ed, #f64f59)", // Rainbow mix
  "linear-gradient(to right, #ff9a9e, #fecfef)", // Sweet pink
  "linear-gradient(to right, #a1c4fd, #c2e9fb)", // Sky morning

  // 🌌 RADIAL GRADIENTS
  "radial-gradient(circle, #ff9a9e, #fad0c4)", // Pink ripple
  "radial-gradient(circle, #43cea2, #185a9d)", // Aqua waves
  "radial-gradient(circle, #fbc2eb, #a6c1ee)", // Pastel splash
  "radial-gradient(circle, #ffecd2, #fcb69f)", // Warm touch
  "radial-gradient(circle, #d299c2, #fef9d7)", // Pink-beige
  "radial-gradient(circle, #ffdde1, #ee9ca7)", // Peach rose
  "radial-gradient(circle, #b7f8db, #50a7c2)", // Fresh sea
  "radial-gradient(circle, #e0c3fc, #8ec5fc)", // Purple teal
  "radial-gradient(circle, #fdfcfb, #e2d1c3)", // Sand cream
  "radial-gradient(circle, #accbee, #e7f0fd)", // Calm sky

  // 🎯 CONIC GRADIENTS
  // "conic-gradient(from 0deg, #ff9a9e, #fad0c4, #ff9a9e)", // Pink spin
  // "conic-gradient(from 90deg, #4facfe, #00f2fe, #4facfe)", // Sky swirl
  // "conic-gradient(from 180deg, #fbc2eb, #a6c1ee)", // Soft wheel
  // "conic-gradient(from 0deg, #f7971e, #ffd200, #f7971e)", // Sunny swirl
  // "conic-gradient(from 0deg at center, #00dbde, #fc00ff)", // Neon ring
  // "conic-gradient(from 45deg at center, #00c3ff, #ffff1c)", // Bright circle
  // "conic-gradient(from 0deg, #e1eec3, #f05053, #e1eec3)", // Soft rotate
  // "conic-gradient(from 90deg, #ff6a00, #ee0979, #ff6a00)", // Flaming twist
  // "conic-gradient(from 0deg, #a1c4fd, #c2e9fb)", // Calm motion
  // "conic-gradient(from 0deg, #12c2e9, #f64f59)", // Color storm

  // 🎨 MIXED SPECIAL EFFECTS
  "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))", // Frosted glass
  "radial-gradient(circle at top left, #ffafbd, #ffc3a0)", // Glow corner
  "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)", // Aqua light
  "radial-gradient(ellipse at center, #89f7fe 0%, #66a6ff 100%)", // Ocean eye
  "conic-gradient(at center, #f2709c, #ff9472)", // Peach cone
  "linear-gradient(to right, #dce35b, #45b649)", // Lemon leaf
  "radial-gradient(circle, #fdfbfb, #ebedee)", // Gray puff
  "linear-gradient(to right, #00b4db, #0083b0)", // Ocean breeze
  "conic-gradient(at center, #74ebd5, #acb6e5)", // Breeze cone
  "radial-gradient(circle, #fffbd5, #b20a2c)", // Sunset splash

  "linear-gradient(to right, #ff7e5f, #feb47b)", // sunset
  "linear-gradient(to right, #4facfe, #00f2fe)", // sky blue
  "linear-gradient(to right, #43e97b, #38f9d7)", // green mint
  "linear-gradient(to right, #f7971e, #ffd200)", // orange yellow
  "linear-gradient(to right, #c33764, #1d2671)", // purple blue
  "linear-gradient(45deg, #ff9a9e, #fad0c4)", // diagonal pink
  "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)", // lavender pink
  "linear-gradient(to right, #e0c3fc 0%, #8ec5fc 100%)", // soft purple-blue
  "#A294F9",
  "#F1F0E8",
  "#89A8B2",
  "#D91656",
  "#640D5F",
  "#355F2E",
  "#441752",
  "#F72C5B",
  "#F0BB78",
  "#131010",
  "#3E5879",
  "#C84C05",
  "#074799",
  "#8D0B41",
  "#7E5CAD",
  "#500073",
  "#8D77AB",
  "#FFE9D6",
  "#D7C1E0",
  "#EEF5FF",
  "#7E30E1",
  "#B0D553",
  "#D4F6CC",
  "#171717",
  "#DA0037",
  "#217756",
  "#008DDA",
  "#664343",
  "#E0AB5B",
  "#FFA6D5",
  "#240750",
  "#3B3030",
  "#5FBDFF",
  "#7B66FF",
  "#FFF8CD",
  "#D4D7DD",
  "#A888B5",
  "#000B58",
  "#F67280",
  "#46B7B9",
  "#8D72E1",
  "#2B580C",
];

const pre_color = [
  "#A294F9",
  "#F1F0E8",
  "#89A8B2",
  "#D91656",
  "#640D5F",
  "#355F2E",
  "#441752",
  "#F72C5B",
  "#F0BB78",
  "#131010",
  "#3E5879",
  "#C84C05",
  "#074799",
  "#8D0B41",
  "#7E5CAD",
  "#500073",
  "#8D77AB",
  "#FFE9D6",
  "#D7C1E0",
  "#EEF5FF",
  "#7E30E1",
  "#B0D553",
  "#D4F6CC",
  "#171717",
  "#DA0037",
  "#217756",
  "#008DDA",
  "#664343",
  "#E0AB5B",
  "#FFA6D5",
  "#240750",
  "#3B3030",
  "#5FBDFF",
  "#7B66FF",
  "#FFF8CD",
  "#D4D7DD",
  "#A888B5",
  "#000B58",
  "#F67280",
  "#46B7B9",
  "#8D72E1",
  "#2B580C",
];

const PostSentence = ({ type = "post" }) => {
  const [text, setText] = useState("");
  const [Errors, setErrors] = useState("");
  const [images, setImages] = useState("");
  const [Pre_Image, setPre_Image] = useState([]);
  const [LazyLoading, setLazyLoading] = useState(false);
  const [isPre_Image, setisPre_Image] = useState(false);
  const textareaRef = useRef(null);
  const [bg_clr, setbg_clr] = useState("#dff");
  const [selectedIndices, setSelectedIndices] = useState([]);
  const nevigate = useNavigate();
  const token = localStorage.getItem("token");
  const { style, admin_user, uploadClicked, setUploadClicked } = useQuote();
  const containerRef = useRef();
  const divRef = useRef(null);

  const handleInput = (idx, e, key) => {
    if (key === "text") {
      setText(e.target.value);
    } else {
      const txt = e.currentTarget.textContent;

      // Force update to plain text (remove extra nodes) // for better styling u can active node like some text bold some text color
      if (divRef.current) {
        divRef.current.textContent = txt || "Type here....";
      }
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleImageChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const image_url = URL.createObjectURL(file);
      // Now you can use image_url (e.g., set it to state)
      console.log(image_url);
      setImages(image_url);
    }
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

  // return becouse of many times img generating
  const handleCapture = async () => {
    // return;
    if (!document.body.contains(containerRef.current)) {
      alert("Element is not attached to DOM");
      return;
    }

    const canvas = await html2canvas(containerRef.current, {
      useCORS: true,
      scale: 4,
      logging: true,
      backgroundColor: null,
      ignoreElements: (el) => {
        return el.tagName === "IMG"; // Skip <img> if it causes CORS error
      },
    });

    const dataURL = canvas.toDataURL("image/png");

    // Optionally upload to Cloudinary
    const formData = new FormData();
    formData.append("file", dataURL);
    formData.append("upload_preset", "page_Image"); // Replace this
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME); // Replace this

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    console.log("Uploaded URL:", res.data.secure_url);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin_user) {
      nevigate("/login") || nevigate("/signup");
    }
    setLazyLoading(true);
    try {
      const ready_url = await handleCapture();
      console.log(ready_url);
      if (ready_url) {
        const res = await axios.post(
          `${API}/api/sentence/post`,
          { ready_url: ready_url, text: text },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUploadClicked(false);
        nevigate("/home");
        // setText("");
        // setImages([]);
      }
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

  const [image, setImage] = useState(null);
  const [statusLoading, setstatusLoading] = useState(false);

  const HandleStatus = async () => {
    if (!admin_user) {
      nevigate("/login") || nevigate("/signup");
    }
    // const [userId, setUserId] = useState(""); // use logged-in user ID
    setstatusLoading(true);
    try {
      const ready_url = await handleCapture();
      const res = await axios.post(
        `${API}/api/crud/create_status`,
        {
          text,
          image: ready_url,
          user: admin_user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Created status:", res.data);
      alert("Status created!");
    } catch (err) {
      console.error("Error creating status:", err);
    }
    setstatusLoading(false);
  };

  // console.log("admin_usernnnn", admin_user);

  return (
    <section
      className="p-0 mb-0 position-fixed overflow-y-auto none-scroller"
      style={{
        margin: "auto",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: uploadClicked ? 10000 : -100,
        // border: "3px solid red",
      }}
    >
      <Accordion activeKey="0" className="">
        <Accordion.Item eventKey="0" className="rounded-0">
          {" "}
          {!uploadClicked && (
            <Accordion.Header className="shadow-0">
              Upload a post
            </Accordion.Header>
          )}
          {uploadClicked && (
            <Accordion.Body className="p-0">
              <div
                className="d-flex justify-content-between"
                style={{ maxWidth: "614px", margin: "auto" }}
              >
                <span
                  className="btn btn-outline-danger rounded-0 m-2 ps-4 pe-4"
                  onClick={() => {
                    setUploadClicked(false);
                  }}
                >
                  Back
                </span>

                <span
                  className="btn btn-primary rounded-0 m-2 ps-3 pe-3"
                  onClick={async () => {
                    await HandleStatus();
                    setUploadClicked(false);
                  }}
                >
                  {statusLoading ? (
                    <Loading dm={24} clr="danger" />
                  ) : (
                    "set as status"
                  )}
                </span>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-100"
                style={{
                  maxWidth: "600px",
                  transform: "scale(1)",
                  margin: "auto",
                }}
              >
                <div className="d-flex flex-column">
                  <div
                    className="border position-relative rounded-0 border-bottom-0"
                    style={{ right: 0, minHeight: "230px" }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex  flex-grow-1 flex-column align-center pe-3 ps-3 p-2 w-100">
                        <QuoteStyler />
                      </div>
                    </div>

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
                        onChange={handleImageChange}
                      />
                    </div>

                    <div
                      className="d-flex  mt-0 position-relative overflow-hidden  bg-for-readyUrl"
                      style={{
                        width: "calc(100% - 0rem)",
                        maxWidth: "600px",
                        aspectRatio: "6/7",
                        background: `${bg_clr}`,
                      }}
                      ref={containerRef}
                    >
                      <div
                        className="rounded-0 w-100 p-2 h-100 bg-for-readyUrl"
                        ref={divRef}
                        src={images ? images : ""}
                        style={{
                          ...style,
                          background: `${images ? `url(${images})` : bg_clr}`,
                        }}
                        spellCheck={false}
                        contentEditable={true}
                      />
                    </div>

                    {/* controller --------------------bgcolor */}
                    <div
                      className="d-flex gap-2 me-3 m-2 ms-3 none-scroller overflow-x-auto overflow-y-hidden"
                      style={{ maxHeight: "80px", maxWidth: "100%" }}
                    >
                      {pre_bg_color.map((c, idx) => {
                        return (
                          <span
                            key={`bg-${idx}`}
                            className="rounded-5 d-block"
                            style={{
                              minWidth: "34px",
                              minHeight: "34px",
                              background: `${c}`,
                              cursor: "pointer",
                              border: `${
                                bg_clr === c
                                  ? "2px solid red"
                                  : "2px solid #f9d8df00"
                              }`,
                            }}
                            onClick={() => {
                              setbg_clr(c);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  {/* above select btn image area */}

                  {type === "post" && (
                    <div className="border">
                      <div className="d-flex gap-2 align-items-center  p-2 pb-0 pt-2">
                        <div
                          className="d-flex fw-semibold ms-1 border text-white rounded-5 align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: `${admin_user?.bg_clr}`,
                          }}
                        >
                          {admin_user?.username?.charAt(0) || "M"}
                        </div>
                        <div>
                          <div style={{ fontWeight: "bold" }}>
                            @{admin_user?.username || "Mahtab"}
                          </div>
                          {/* <small style={{ color: "#888" }}>Visibility: Public</small> */}
                        </div>
                      </div>
                      <div className="ps-1">
                        <textarea
                          ref={textareaRef}
                          value={text}
                          onChange={(e) => {
                            handleInput(0, e, "text");
                          }}
                          className={`form-control rounded-0 shadow-none ps-2 pe-2 border-0`}
                          placeholder="Write about post here . . ."
                          style={{ overflow: "hidden", resize: "none" }}
                          spellCheck="false"
                          required
                        />
                      </div>
                    </div>
                  )}
                  {Errors && (
                    <small
                      className="text-danger position-absolute ps-3"
                      style={{ top: "-5px" }}
                    >
                      {Errors}
                    </small>
                  )}
                  <br />

                  {/* {browsssss imggggg} */}
                  <div className="d-flex gap-3 p-2 justify-content-end p-0 pb-5 mb-4">
                    {/* {isPre_Image} */}

                    <label
                      htmlFor="images"
                      className="btn btn-outline-primary ps-3 pe-3 rounded-0 p-2"
                      style={{ height: "42px" }}
                    >
                      Browse Image
                    </label>

                    {type === "post" && (
                      <button
                        type={LazyLoading ? "button" : "submit"}
                        className="btn btn-outline-danger flex-grow-1 ps-5 pe-5 rounded-0"
                        style={{ height: "42px" }}
                      >
                        {LazyLoading ? <Loading clr={"white"} /> : "Post"}
                      </button>
                    )}

                    {type === "status" && (
                      <button
                        className="btn btn-outline-danger flex-grow-1 ps-5 pe-5 rounded-0"
                        style={{ height: "42px" }}
                        onClick={() => {
                          HandleStatus();
                        }}
                      >
                        Send
                      </button>
                    )}
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
            </Accordion.Body>
          )}
        </Accordion.Item>
      </Accordion>
    </section>
  );
};

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaSuperscript,
  FaSubscript,
  FaFont,
  FaHighlighter,
  FaTextHeight,
  FaTextWidth,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaListUl,
  FaListOl,
  FaSortAlphaDown,
  FaParagraph,
} from "react-icons/fa";

import {
  FaRegSun, // Could represent "glow" effect
  FaPaintBrush, // Styling/text effects
  FaAdjust, // Used for contrast/shadow
  FaLayerGroup, // For multi-layer effects like shadows
  FaRegSquare, // Could be used to symbolize a backdrop or outline
  FaMagic, // For visual effects like shadows/glow
  FaFireAlt, // Can represent a fiery text effect (strong glow)
} from "react-icons/fa";

const QuoteStyler = () => {
  const [active_style, setActive_style] = useState("fontSize");

  const { quote, style, setStyle } = useQuote();
  const fontFamily = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Comic Sans MS",
    "Tahoma",
    "Lucida Console",
    "Helvetica",
    "Trebuchet MS",
    "Impact",
    "Palatino Linotype",
    "Book Antiqua",
    "Lucida Sans Unicode",
    "Garamond",
    "Segoe UI",
    "Roboto",
    "Open Sans",
  ];

  const fontSize = [
    "0.1rem",
    "0.2rem",
    "0.3rem",
    "0.4rem",
    "0.5rem",
    "0.6rem",
    "0.7rem",
    "0.8rem",
    "0.9rem",
    "1.0rem",
    "1.1rem",
    "1.2rem",
    "1.3rem",
    "1.4rem",
    "1.5rem",
    "1.6rem",
    "1.7rem",
    "1.8rem",
    "1.9rem",
    "2.2rem",
    "2.4rem",
    "2.6rem",
    "2.8rem",
    "3.0rem",
    "3.4rem",
    "3.8rem",
    "4.0rem",
    "4.5rem",
    "5.0rem",
  ];

  const fontWeight = [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "bold",
    "bolder",
    "700",
    "800",
    "900",
    "1000",
  ];

  const letterSpacing = [
    "0.5px",
    "1px",
    "1.5px",
    "2px",
    "2.5px",
    "3px",
    "3.5px",
    "4px",
    "4.5px",
    "5px",
    "5.5px",
    "6px",
    "6.5px",
    "7px",
    "7.5px",
    "8px",
    "9px",
    "10px",
  ];

  const textAlign = ["left", "center", "right", "justify"];

  const textDecoration = [
    "none",
    "underline",
    "overline",
    "line-through",
    "thick",
    "inherit",
    "initial",
    "unset",
  ];

  const fontStyle = ["normal", "italic"];

  const textShadow = [
    "1px 1px 2px black",
    "2px 2px 4px rgba(0, 0, 0, 0.5)",
    "0 0 3px #FF0000",
    "0 0 5px #00FFFF",
    "1px 0 5px #000",
    "2px 2px 0 #999",
    "0 1px 3px rgba(0,0,0,0.3)",
    "1px 1px 1px rgba(255,255,255,0.8)",
    "2px 2px 8px #444",
    "0 0 10px #FFF, 0 0 20px #F0F, 0 0 30px #0FF",
    "3px 3px 5px rgba(0,0,0,0.7)",
    "1px 2px 2px #333",
    "-1px -1px 0 #000, 1px 1px 0 #fff", // outline effect
    "4px 4px 6px rgba(0,0,0,0.4)",
    "0px 4px 3px rgba(0, 0, 0, 0.3)",
  ];

  const backgroundPosition = [
    "center top",
    "center center",
    "center bottom",
    "bottom",
    "top",
    "right",
    "left",
  ];

  const backgroundSize = [
    "auto", // default
    "cover", // scale to cover entire area
    "contain", // scale to fit inside the area
    "100% 100%", // stretch to fill
    "50% 50%", // half width and height
    "100% auto", // full width, auto height
    "auto 100%", // auto width, full height
  ];

  const handleStyleChange = (prop, value) => {
    setStyle((prev) => ({ ...prev, [prop]: value }));
  };

  return (
    <>
      <div className="d-flex gap-2 mt-1 btn-tool overflow-x-auto none-scroller">
        <div
          className="btn btn-outline-primary d-flex align-items-center rounded-0 p-0 pe-2 ps-2 fontFamily"
          onClick={() => {
            setActive_style("fontFamily");
          }}
          style={{
            cursor: "pointer",
            background: `${active_style === "fontFamily" ? "#47e" : ""}`,
            color: `${active_style === "fontFamily" ? "#fff" : ""}`,
          }}
        >
          <FaFont />
        </div>

        <div
          className="btn btn-outline-primary  d-flex align-items-center  rounded-0 p-0  pe-2 ps-2 fontSize"
          onClick={() => {
            setActive_style("fontSize");
          }}
          style={{
            cursor: "pointer",
            background: `${active_style === "fontSize" ? "#47e" : ""}`,
            color: `${active_style === "fontSize" ? "#fff" : ""}`,
          }}
        >
          <FaTextHeight title="Increase Font Size" />
        </div>

        <div
          className="btn btn-outline-primary  d-flex align-items-center  rounded-0 p-0  pe-2 ps-2 fontSize"
          onClick={() => {
            setActive_style("fontStyle");
          }}
          style={{
            cursor: "pointer",
            background: `${active_style === "fontStyle" ? "#47e" : ""}`,
            color: `${active_style === "fontStyle" ? "#fff" : ""}`,
          }}
        >
          <FaItalic title="Font Style" />
        </div>
        <div
          className="btn btn-outline-primary  d-flex align-items-center  rounded-0 p-0  pe-2 ps-2 fontWeight"
          onClick={() => {
            setActive_style("fontWeight");
          }}
          style={{
            cursor: "pointer",
            background: `${active_style === "fontWeight" ? "#47e" : ""}`,
            color: `${active_style === "fontWeight" ? "#fff" : ""}`,
          }}
        >
          <FaBold title="Highlight" />
        </div>
        <div
          className="btn btn-outline-primary  d-flex align-items-center  rounded-0 p-0   pe-2 ps-2 textDecoration"
          onClick={() => {
            setActive_style("textShadow");
          }}
          style={{
            cursor: "pointer",
            background: `${active_style === "textShadow" ? "#47e" : ""}`,
            color: `${active_style === "textShadow" ? "#fff" : ""}`,
          }}
        >
          {/* <FaShadow title="FaShadow" /> */}
          <FaMagic title="FaShadow" />
        </div>

        <div
          className="btn btn-outline-primary  d-flex align-items-center  rounded-0 p-0   pe-2 ps-2 textDecoration"
          onClick={() => {
            setActive_style("textDecoration");
          }}
          style={{
            cursor: "pointer",
            background: `${active_style === "textDecoration" ? "#47e" : ""}`,
            color: `${active_style === "textDecoration" ? "#fff" : ""}`,
          }}
        >
          <FaStrikethrough title="Strikethrough" />
        </div>

        <div
          className="btn btn-outline-primary  d-flex align-items-center  rounded-0 p-0  pe-2 ps-2 textAlign"
          onClick={() => {
            setActive_style("color");
          }}
          style={{
            cursor: "pointer",
            background: `${active_style === "color" ? "#47e" : ""}`,
            color: `${active_style === "color" ? "#fff" : ""}`,
          }}
        >
          Color
        </div>

        <div
          className="btn btn-outline-primary  d-flex align-items-center  rounded-0 p-0   pe-2 ps-2 letterSpacing"
          onClick={() => {
            setActive_style("letterSpacing");
          }}
          style={{
            cursor: "pointer",
            background: `${active_style === "letterSpacing" ? "#47e" : ""}`,
            color: `${active_style === "letterSpacing" ? "#fff" : ""}`,
          }}
        >
          Spacing
        </div>

        <div
          className="btn btn-outline-primary  d-flex align-items-center  rounded-0 p-0  pe-2 ps-2 textAlign"
          onClick={() => {
            setActive_style("textAlign");
          }}
          style={{
            cursor: "pointer",
            background: `${active_style === "textAlign" ? "#47e" : ""}`,
            color: `${active_style === "textAlign" ? "#fff" : ""}`,
          }}
        >
          <FaAlignCenter title="center" />
        </div>

        <div
          className="btn btn-outline-primary  d-flex align-items-center  rounded-0 p-0  pe-2 ps-2 backgroundPosition "
          onClick={() => {
            setActive_style("backgroundPosition");
          }}
          style={{
            cursor: "pointer",
            background: `${
              active_style === "backgroundPosition" ? "#47e" : ""
            }`,
            color: `${active_style === "backgroundPosition" ? "#fff" : ""}`,
          }}
        >
          Image Position
          {/* <FaAlignCenter title="center" /> */}
        </div>

        <div
          className="btn btn-outline-primary  d-flex align-items-center  rounded-0 p-0  pe-2 ps-2 backgroundPosition "
          onClick={() => {
            setActive_style("backgroundSize");
          }}
          style={{
            cursor: "pointer",
            background: `${active_style === "backgroundSize" ? "#47e" : ""}`,
            color: `${active_style === "backgroundSize" ? "#fff" : ""}`,
          }}
        >
          Image Size
          {/* <FaAlignCenter title="center" /> */}
        </div>
      </div>

      {[
        { curr_style: "fontSize", replace: "px", Props: fontSize },
        { curr_style: "fontWeight", replace: "", Props: fontWeight },
        { curr_style: "fontFamily", replace: "", Props: fontFamily },
        { curr_style: "textAlign", replace: "", Props: textAlign },
        { curr_style: "letterSpacing", replace: "px", Props: letterSpacing },
        { curr_style: "color", replace: "", Props: pre_color },
        { curr_style: "textShadow", replace: "", Props: textShadow },
        { curr_style: "backgroundSize", replace: "", Props: backgroundSize },
        {
          curr_style: "backgroundPosition",
          replace: "",
          Props: backgroundPosition,
        },
        { curr_style: "fontStyle", replace: "", Props: fontStyle },
        { curr_style: "", replace: "", Props: fontStyle },
        {
          curr_style: "textDecoration",
          replace: "",
          Props: textDecoration,
        },
      ].map((el, idx) => {
        return (
          active_style === el.curr_style && (
            <Driver
              Props={el.Props}
              handleStyleChange={handleStyleChange}
              val={active_style}
              to={el.to || ""}
              replace={el.replace}
              key={idx}
            />
          )
        );
      })}
    </>
  );
};

const Driver = ({ Props, handleStyleChange, val, replace = "", to }) => {
  const [active_opt, setActive_opt] = useState(null);
  return (
    <>
      <div
        className="all_option d-flex align-items-center w-100 overflow-x-auto none-scroller"
        style={{ maxWidth: "100%" }}
        key={val}
      >
        {Props.map((size, idx) => (
          <option
            className="ps-2 me-1 pe-2 d-block mt-2 rounded-0"
            key={idx}
            value={size}
            onClick={(e) => {
              handleStyleChange(val, e.target.value);
              setActive_opt(size);
            }}
            style={{
              cursor: "pointer",
              background: `${active_opt === size ? "#47e2" : "#0000"}`,
              color: `${active_opt === size ? "" : size}`,
              fontFamily: `${active_opt === size ? "inherit" : size}`,
              fontWeight: `${active_opt === size ? "" : size}`,
              textDecoration: `${active_opt === size ? "" : size}`,
              fontStyle: `${active_opt === size ? "" : size}`,
              textShadow: `${active_opt === size ? "" : size}`,
              // fontSize: `${active_opt === size ? "#47e" : size}`,
              fontSize: `${
                val === "textShadow" ||
                val === "color" ||
                val === "textDecoration" ||
                val === "fontWeight"
                  ? "24px"
                  : ""
              }`,
            }}
          >
            {val === "textShadow"
              ? "A"
              : val === "color"
              ? "A"
              : val === "textDecoration"
              ? "A"
              : val === "fontWeight"
              ? "A"
              : size.replace(replace, to)}
          </option>
        ))}
      </div>
    </>
  );
};

export default PostSentence;
