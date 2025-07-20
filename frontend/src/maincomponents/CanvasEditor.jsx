import React, { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Rnd } from "react-rnd";
import { useQuote } from "../context/QueotrContext";
import { Loading } from "../../TinyComponent/LazyLoading";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

import {
  faTextHeight,
  faImage,
  faTrash,
  faArrowUp,
  faBold,
  faItalic,
  faUnderline,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

import { FaStrikethrough, FaFont, FaTextHeight } from "react-icons/fa";

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

const color = [
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
];

const fontSize = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 24, 26, 28, 30, 34, 38,
  40, 45, 50, 55, 60, 70,
];

const letterSpacing = [
  0.1, 0.2, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 24, 26, 28, 30, 34, 38,
];

const textDecoration = ["none", "underline", "overline", "line-through"];

const textShadow = [
  "none",
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

const boxShadow = [
  "none",
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

import { useTheme } from "../context/Theme";

import {
  FaRegSun, // Could represent "glow" effect
  FaPaintBrush, // Styling/text effects
  FaAdjust, // Used for contrast/shadow
  FaLayerGroup, // For multi-layer effects like shadows
  FaRegSquare, // Could be used to symbolize a backdrop or outline
  FaMagic, // For visual effects like shadows/glow
  FaFireAlt, // Can represent a fiery text effect (strong glow)
} from "react-icons/fa";

const CanvasVibeEditor = () => {
  const [elements, setElements] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [canvasHeight, setCanvasHeight] = useState(440);
  const [canvasBgColor, setCanvasBgColor] = useState("#3c3c3c");
  const [exporting, setExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState(null);
  const [active_style, setActive_style] = useState(fontFamily);
  const [style_type, setStyle_type] = useState("fontFamily");
  const [count, setCount] = useState(0);
  const DragcanvasRef = useRef(null);

  const canvasRef = useRef(null);
  const nevigate = useNavigate();

  let idCounter =
    elements.length > 0 ? Math.max(...elements.map((el) => el.id)) + 1 : 1;

  const addTextBox = () => {
    const newText = {
      id: idCounter++,
      type: "text",
      content: "Type Here",
      x: 50,
      y: 50,
      width: 100,
      height: 60,
      fontSize: 28,
      fontFamily: "Arial",
      color: "#a6e9f1",
      zIndex: elements.length + 1,
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      background: "00000000",
      letterSpacing: "1",
      textAlign: "left",
      textShadow: "",
      backgroundPosition: "",
    };
    setElements([...elements, newText]);
    setActiveId(newText.id);
  };

  const addImageBox = (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newImage = {
      id: idCounter++,
      type: "image",
      src: url,
      x: 10,
      y: 10,
      width: 40,
      height: 10,
      zIndex: elements.length + 1,
      background: "00000000",
      boxShadow: "",
    };
    setElements([...elements, newImage]);
    setActiveId(newImage.id);
  };

  const handleChange = (id, key, value) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, [key]: value } : el))
    );

    console.log("val ", value);
  };

  const handleResizeOrDrag = (id, width, height, x, y) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, ...width, ...height, ...x, ...y } : el
      )
    );
  };

  const setContinuousActiveId = () => {
    const len = elements.length;
    if (len > 0) {
      setActiveId(elements[count % len]?.id);
      setCount(count + 1);
    }
  };

  const deleteElement = (id) => {
    const conf = window.confirm("want to delete this element !");
    if (conf) {
      setElements((prev) => prev.filter((el) => el.id !== id));
    }
  };

  const bringToFront = (id) => {
    setElements((prev) => {
      const maxZIndex = Math.max(...prev.map((el) => el.zIndex), 0);
      return prev.map((el) =>
        el.id === id ? { ...el, zIndex: maxZIndex + 1 } : el
      );
    });
  };

  function base64ToBlob(base64, contentType = "image/png") {
    const byteCharacters = atob(base64.split(",")[1]); // Remove data:image/png;base64, part
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  const exportAsImage = async () => {
    if (!canvasRef.current) return;

    try {
      setExporting(true);
      const dataUrl = await toPng(canvasRef.current, {
        backgroundColor: canvasBgColor,
        pixelRatio: 2, // Higher quality
      });

      const blob = base64ToBlob(dataUrl, "image/png");
      const blobUrl = URL.createObjectURL(blob);
      setExportUrl(dataUrl); // This is now a shorter blob URL

      setExporting(false);

      console.log("blob ", `blob:${blobUrl}`);
      return dataUrl;
    } catch (error) {
      console.error("Error exporting image:", error);
      setExporting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        DragcanvasRef.current &&
        !DragcanvasRef.current.contains(event.target)
      ) {
        setActiveId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeElement = elements.find((el) => el.id === activeId);

  // -----------------------------------posting-----------------------------
  const [activeBtn3Profile, setActiveBtn3Profile] = useState("public");
  const [text, setText] = useState("");
  const [LazyLoading, setLazyLoading] = useState(false);

  const {
    style,
    admin_user,
    uploadClicked,
    setUploadClicked,
    sm_break_point,
    mobile_break_point,
    openSlidWin,
    setopenSlidWin,
  } = useQuote();

  const handleCapture = async () => {
    const dataURL = await exportAsImage();

    const formData = new FormData();
    formData.append("file", dataURL);
    formData.append("upload_preset", "page_Image");
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    console.log("Uploaded URL:", res.data.secure_url);
    return res.data.secure_url;
  };

  const [error, setError] = useState("");

  const handleInput = (idx, e, key) => {
    if (key === "text") {
      setText(e.target.value);
    }

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin_user) {
      const confirm = window.confirm("You have to sign up or login to post");
      if (confirm) {
        nevigate("/login") || nevigate("/signup");
      }
    } else if (text == "") {
      setError("Plese write something aboute post !");
      return;
    }

    setLazyLoading(true);

    try {
      const ready_url = await handleCapture();
      console.log("ready url ", ready_url);

      if (ready_url) {
        const res = await axios.post(
          `${API}/api/sentence/post`,
          { ready_url: ready_url, text: text, mode: activeBtn3Profile },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUploadClicked(false);
        alert("Uploaded Successfully");
        setopenSlidWin(false);
        nevigate("/home");
      }
    } catch (err) {
      alert(
        "Failed to post, Connection Error or internal issue: " +
          (err.response?.data?.message || err.message)
      );
      // setErrors(err.response?.data?.message || err.message);
      console.error("Error saving sentence", err);
    }
    setLazyLoading(false);
  };

  const { text_clrH, text_clrL, text_clrM, mainbg } = useTheme();

  useEffect(() => {
    if (elements.length <= 0) {
      addTextBox();
    }
  }, []);

  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="shadow-lg" style={{ background: mainbg }}>
      <div className="">
        <div className="pt-0">
          <div className="d-flex">
            <div
              className="card border-0 shadow-sm "
              style={{ background: mainbg }}
            >
              <div
                className="b-2 position-fixed"
                style={{
                  zIndex: 900000000000000,
                  left: `${
                    mobile_break_point ? 0 : sm_break_point ? "60px" : "227px"
                  }`,
                  right: 0,
                  top: "40px",
                  background: mainbg,
                }}
              >
                <div className="d-flex overflow-x-auto none-scroller gap-2 mt-2 mx-2">
                  <button
                    className={`toolbar-button   ${
                      activeElement?.fontWeight === "bold" ? "active" : ""
                    }`}
                    style={{ minWidth: "34px" }}
                    onClick={() =>
                      handleChange(
                        activeElement?.id,
                        "fontWeight",
                        activeElement?.fontWeight === "bold" ? "normal" : "bold"
                      )
                    }
                    disabled={!activeElement}
                  >
                    <FontAwesomeIcon
                      icon={faBold}
                      fontSize={12}
                      color={text_clrM}
                    />
                  </button>

                  <button
                    className={`toolbar-button ${
                      activeElement?.fontStyle === "italic" ? "active" : ""
                    }`}
                    style={{ minWidth: "34px" }}
                    onClick={() =>
                      handleChange(
                        activeElement?.id,
                        "fontStyle",
                        activeElement?.fontStyle === "italic"
                          ? "normal"
                          : "italic"
                      )
                    }
                    disabled={!activeElement}
                  >
                    <FontAwesomeIcon
                      icon={faItalic}
                      fontSize={12}
                      color={text_clrM}
                    />
                  </button>

                  <button
                    className={`toolbar-button ${
                      activeElement?.textDecoration === "underline"
                        ? "active"
                        : ""
                    }`}
                    style={{ minWidth: "34px" }}
                    onClick={() =>
                      handleChange(
                        activeElement?.id,
                        "textDecoration",
                        activeElement?.textDecoration === "underline"
                          ? "none"
                          : "underline"
                      )
                    }
                    disabled={!activeElement}
                  >
                    <FontAwesomeIcon
                      icon={faUnderline}
                      fontSize={12}
                      color={text_clrM}
                    />
                  </button>

                  <button
                    className={`toolbar-button ${
                      activeElement?.textAlign === "left" ? "active" : ""
                    }   props-btn `}
                    onClick={() =>
                      handleChange(activeElement?.id, "textAlign", "left")
                    }
                    disabled={!activeElement}
                    style={{ minWidth: "34px" }}
                  >
                    <FontAwesomeIcon
                      icon={faAlignLeft}
                      fontSize={12}
                      color={text_clrM}
                    />
                  </button>

                  <button
                    className={`toolbar-button ${
                      activeElement?.textAlign === "center" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleChange(activeElement?.id, "textAlign", "center")
                    }
                    disabled={!activeElement}
                    style={{ minWidth: "34px" }}
                  >
                    <FontAwesomeIcon
                      icon={faAlignCenter}
                      fontSize={12}
                      color={text_clrM}
                    />
                  </button>

                  <button
                    className={`toolbar-button ${
                      activeElement?.textAlign === "right" ? "active" : ""
                    }`}
                    style={{ minWidth: "34px" }}
                    onClick={() =>
                      handleChange(activeElement?.id, "textAlign", "right")
                    }
                    disabled={!activeElement}
                  >
                    <FontAwesomeIcon
                      icon={faAlignRight}
                      fontSize={12}
                      color={text_clrM}
                    />
                  </button>

                  <button
                    className={`btn props-btn toolbar-button ${
                      activeElement ? "active" : ""
                    }`}
                    onClick={() => setActiveId(null)}
                    style={{
                      border: `1px solid ${text_clrL}`,
                      minWidth: "max-content",
                    }}
                    disabled={!activeElement}
                  >
                    <b style={{ color: text_clrM }}>- / -</b>
                  </button>

                  <div
                    className="btn overflow-hidden p-0 props-btn toolbar-button"
                    style={{ border: `` }}
                  >
                    <input
                      type="color"
                      value={activeElement?.color}
                      style={{
                        scale: "2",
                        border: ``,
                      }}
                      onChange={(e) =>
                        handleChange(activeElement?.id, "color", e.target.value)
                      }
                      defaultValue={"#ff0000"}
                    />
                  </div>

                  <div
                    className="props-btn toolbar-button"
                    style={{
                      border: `1px solid ${text_clrL}`,
                      minWidth: "120px",
                    }}
                  >
                    <div
                      className="btn overflow-hidden  d-flex align-items-center p-0 gap-1 rounded-0 justify-content-between  border-0"
                      style={{ translate: "6px" }}
                    >
                      <small
                        className="flex-grow-1"
                        style={{ color: text_clrM }}
                      >
                        Background
                      </small>
                      <div className="btn overflow-hidden flex-grow-1 props-btn rounded-0 p-0">
                        <input
                          type="color"
                          className="form-control form-control-color w-100 props-btn border"
                          style={{ scale: 3 }}
                          value={
                            activeElement
                              ? activeElement.background
                              : "00000000"
                          }
                          onChange={(e) =>
                            activeElement
                              ? handleChange(
                                  activeId,
                                  "background",
                                  e.target.value
                                )
                              : setCanvasBgColor(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className="props-btn fw-medium toolbar-button flex-grow-1"
                    style={{
                      border: `1px solid ${text_clrL}`,
                      minWidth: "84px",
                    }}
                    disabled={!activeElement}
                    onClick={() => {
                      activeElement
                        ? handleChange(activeId, "background", "00000000")
                        : "";
                    }}
                  >
                    &nbsp; reset bg&nbsp;
                  </button>

                  <button
                    className="btn props-btn toolbar-button"
                    onClick={() => {
                      setContinuousActiveId();
                    }}
                    style={{ minWidth: "max-content" }}
                  >
                    <b style={{ color: text_clrM }}>Active</b>
                  </button>

                  <button
                    className={`toolbar-button ${
                      activeElement ? "active" : ""
                    }`}
                    onClick={() => bringToFront(activeElement?.id)}
                    disabled={!activeElement}
                    style={{ minWidth: "34px" }}
                  >
                    <FontAwesomeIcon icon={faArrowUp} color={text_clrM} />
                  </button>

                  <button
                    className={`btn  toolbar-button ${
                      activeElement ? "active" : ""
                    }`}
                    style={{ minWidth: "max-content" }}
                    onPointerDown={() => {
                      if (activeElement) {
                        deleteElement(activeElement?.id);
                      }
                    }}
                    disabled={!activeElement}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>

                <div className="d-flex gap-2 btn-tool overflow-x-auto none-scroller border-top pt-2 m-2">
                  <div
                    className="toolbar-button d-flex align-items-center rounded-1 px-2 fontFamily "
                    onClick={() => {
                      setActive_style(fontFamily);
                      setStyle_type("fontFamily");
                    }}
                    style={{
                      cursor: "pointer",
                      background: `${
                        active_style === fontFamily ? "#6b0ad2" : ""
                      }`,
                      color: `${active_style === fontFamily ? "#fff" : ""}`,
                    }}
                  >
                    <FaFont />
                  </div>

                  <div
                    className="toolbar-button  d-flex align-items-center  rounded-1 p-0  pe-2 ps-2 fontSize"
                    onClick={() => {
                      setActive_style(fontSize);
                      setStyle_type("fontSize");
                    }}
                    style={{
                      cursor: "pointer",
                      background: `${
                        active_style === fontSize ? "#6b0ad2" : ""
                      }`,
                      color: `${active_style === fontSize ? "#fff" : ""}`,
                    }}
                  >
                    <FaTextHeight title="Increase Font Size" />
                  </div>

                  <div
                    className="toolbar-button  d-flex align-items-center  rounded-1 p-0   pe-2 ps-2 textDecoration"
                    onClick={() => {
                      setActive_style(textShadow);
                      setStyle_type("textShadow");
                    }}
                    style={{
                      cursor: "pointer",
                      background: `${
                        active_style === textShadow ? "#6b0ad2" : ""
                      }`,
                      color: `${active_style === textShadow ? "#fff" : ""}`,
                    }}
                  >
                    {/* <FaShadow title="FaShadow" /> */}
                    <FaMagic title="FaShadow" />
                  </div>

                  <div
                    className="toolbar-button  d-flex align-items-center  rounded-1 p-0   pe-2 ps-2 textDecoration"
                    onClick={() => {
                      setActive_style(textDecoration);
                      setStyle_type("textDecoration");
                    }}
                    style={{
                      cursor: "pointer",
                      background: `${
                        active_style === textDecoration ? "#6b0ad2" : ""
                      }`,
                      color: `${active_style === textDecoration ? "#fff" : ""}`,
                    }}
                  >
                    <FaStrikethrough title="Strikethrough" />
                  </div>

                  <div
                    className="toolbar-button  d-flex align-items-center  rounded-1 p-0   pe-2 ps-2 textDecoration"
                    onClick={() => {
                      setActive_style(color);
                      setStyle_type("color");
                    }}
                    style={{
                      cursor: "pointer",
                      background: `${active_style === color ? "#6b0ad2" : ""}`,
                      color: `${active_style === color ? "#fff" : ""}`,
                    }}
                  >
                    Color
                  </div>

                  <div
                    className="toolbar-button  d-flex align-items-center  rounded-1 p-0   pe-2 ps-2 letterSpacing"
                    onClick={() => {
                      setActive_style(letterSpacing);
                      setStyle_type("letterSpacing");
                    }}
                    style={{
                      cursor: "pointer",
                      background: `${
                        active_style === letterSpacing ? "#6b0ad2" : ""
                      }`,
                      color: `${active_style === letterSpacing ? "#fff" : ""}`,
                    }}
                  >
                    Spacing
                  </div>

                  <div
                    className="toolbar-button d-flex align-items-center  rounded-1 p-0  pe-2 ps-2 backgroundPosition "
                    onClick={() => {
                      setActive_style(boxShadow);
                      setStyle_type("boxShadow");
                    }}
                    style={{
                      cursor: "pointer",
                      background: `${
                        active_style === boxShadow ? "#6b0ad2" : ""
                      }`,
                      color: `${active_style === boxShadow ? "#fff" : ""}`,
                    }}
                  >
                    box Shadow
                  </div>
                </div>

                <div className="d-flex gap-2 text-light mx-2 mb-2 overflow-x-auto overflow-y-hidden none-scroller">
                  {active_style.map((op) => (
                    <button
                      className={`props-btn toolbar-button ${
                        activeElement?.[style_type] == op ? "active" : ""
                      }`}
                      style={{
                        color: text_clrM,
                        minWidth: "fit-content",
                        minHeight: "max-height",
                        boxShadow: `${style_type == "boxShadow" ? op : ""}`,
                      }}
                      onClick={() => {
                        handleChange(activeId, style_type, op);
                      }}
                    >
                      <span
                        className="btn border-0 p-2"
                        style={{
                          color: text_clrM,
                          [style_type]: `${
                            op == "fontSize" || style_type == "boxShadow"
                              ? ""
                              : op
                          }`,
                        }}
                      >
                        {style_type == "textShadow" || style_type == "boxShadow"
                          ? "A"
                          : op}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="card border-0 shadow-sm position-sticky m-2 bg-dark">
                  <details className="bg-dark mx-2">
                    <summary
                      className="mx-1 fs-4"
                      style={{ color: text_clrH }}
                      onClick={() => {
                        setDetailsOpen(!detailsOpen);
                      }}
                    ></summary>
                    {mobile_break_point && (
                      <div className=" mx-2">
                        <textarea
                          className="form-control w-100 overflow-auto none-scroller py-2"
                          value={activeElement?.content}
                          style={{
                            background: mainbg,
                            color: text_clrM,
                            border: `1px solid ${text_clrL}`,
                            minHeight: "80px",
                          }}
                          placeholder="Click Add Text and then write Here !"
                          spellCheck={false}
                          onChange={(e) =>
                            handleChange(
                              activeElement?.id,
                              "content",
                              e.target.value
                            )
                          }
                        >
                          {activeElement?.content || "Type Here"}
                        </textarea>
                      </div>
                    )}

                    <div className="mx-2 my-0">
                      <input
                        type="range"
                        min={100}
                        max={800}
                        step={10}
                        onChange={(e) =>
                          setCanvasHeight(parseInt(e.target.value))
                        }
                        style={{ height: "6px" }}
                        className="w-100 "
                      />
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: `${detailsOpen ? `310px` : "204px"}`,
                width: "100%",
              }}
            >
              <div
                ref={canvasRef}
                className="canvas-container w-100"
                style={{
                  height: `${canvasHeight}px`,
                  background: canvasBgColor,
                  position: "relative",
                  overflow: "hidden",
                  maxWidth: "601px",

                  margin: "auto",
                }}
              >
                {elements.map((el) => (
                  <Rnd
                    key={el.id}
                    style={{
                      left: `${el.x}px`,
                      top: `${el.y}px`,
                      width: `${el.width}px`,
                      height: `${el.height}px`,
                      zIndex: el.zIndex,
                      border: activeId === el.id ? "2px dashed #0d6efd" : "",
                      boxShadow:
                        activeId === el.id
                          ? "0 0 10px rgba(13, 110, 253, 0.5)"
                          : "none",
                      cursor: activeElement ? "move" : "",
                    }}
                    spellCheck={false}
                    disableDragging={activeElement?.id == el.id ? false : true}
                    enableUserSelectHack={
                      activeElement?.id == el.id ? true : false
                    }
                    enableResizing={activeElement?.id == el.id ? true : false}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(el.id);
                    }}
                  >
                    <div
                      className="w-100 h-100 position-relative"
                      onDrag={() => {
                        handleResizeOrDrag(
                          el.id,
                          el.width,
                          el.height,
                          el.x,
                          el.y
                        );
                      }}
                    >
                      {activeId === el.id && (
                        <>
                          <button
                            className="btn text-light bg-danger btn-sm p-0 d-flex align-items-center justify-content-center position-absolute top-0 end-0 rounded-1"
                            style={{
                              zIndex: 1000,
                              width: "18px",
                              height: "18px",
                            }}
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              setActiveId(null);
                            }}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>

                          <div
                            className="position-absolute bottom-0 end-0 bg-primary rounded-circle"
                            style={{
                              width: "12px",
                              height: "12px",
                              cursor: "nwse-resize",
                            }}
                          ></div>
                        </>
                      )}

                      {el.type === "text" ? (
                        <div
                          className="text-element overflow-hidden outline-none w-100 h-100 none-scroller p-2"
                          style={{
                            fontSize: `${el.fontSize}px`,
                            color: el.color,
                            fontFamily: el.fontFamily,
                            fontWeight: el.fontWeight,
                            fontStyle: el.fontStyle,
                            textDecoration: el.textDecoration,
                            textAlign: el.textAlign,
                            background: el.background,
                            whiteSpace: "pre-wrap",
                            userSelect: "none",
                            letterSpacing: `${el.letterSpacing}px`,
                            textShadow: el.textShadow,
                            boxShadow: el.boxShadow,
                          }}
                          contentEditable={
                            activeElement?.id === el?.id ? true : false
                          }
                          suppressContentEditableWarning={true}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              document.execCommand(
                                "insertHTML",
                                false,
                                "<br><br>"
                              );
                            }
                          }}
                        >
                          {el.content}
                        </div>
                      ) : (
                        <div className="overflow-hidden d-flex align-items-center justify-content-center h-100 w-100">
                          <img
                            src={el.src}
                            alt="uploaded"
                            className="image-element overflow-hidden w-100"
                            draggable={false}
                            style={{
                              objectFit: "cover",
                              boxShadow: el.boxShadow,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Rnd>
                ))}

                {elements.length === 0 && (
                  <div className="empty-canvas w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white-50">
                    <h4>Add text or images to get started</h4>
                    <p className="text-center">
                      Click the buttons below to add elements
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="d-flex gap-2 pt-2 none-scroller overflow-x-auto overflow-y-hidden"
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
                  canvasBgColor === c ? "2px solid red" : "2px solid #f9d8df00"
                }`,
              }}
              onClick={() => {
                setCanvasBgColor(c);
              }}
            />
          );
        })}
      </div>

      <div className="py-2" style={{ background: mainbg }}>
        <>
          <div
            className="d-flex flex-row-reverse props-parent flex-wrap gap-2 overflow-x-auto"
            style={{
              height: "max-content",
            }}
          >
            <button className="btn flex-grow-1 overflow-hidden btn-success props-btn rounded-0 p-0">
              <label className="btn btn-success props-btn gap-2 rounded-0 w-100">
                Add <FontAwesomeIcon icon={faImage} color={text_clrH} />
                <input
                  type="file"
                  className="d-none"
                  accept="image/*"
                  onChange={(e) => addImageBox(e.target.files[0])}
                />
              </label>
            </button>

            <button
              className="btn overflow-hidden btn-primary p-0 props-btn rounded-0"
              onClick={addTextBox}
            >
              <div className="props-btn rounded-0">
                Add Text &nbsp;
                <FontAwesomeIcon icon={faTextHeight} className="me-2" />
              </div>
            </button>
          </div>
        </>
      </div>

      <div className="d-flex gap-3 pt-2 ">
        <button
          className={`btn border p-1 ps-2 pe-2 rounded-5  ${
            activeBtn3Profile === "public" ? "btn-dark" : ""
          }`}
          onClick={() => setActiveBtn3Profile("public")}
          style={{ color: text_clrM }}
        >
          <small> For Public</small>
        </button>
        <button
          className={`btn border p-1 ps-2 pe-2 rounded-5 ${
            activeBtn3Profile === "Follower" ? "btn-dark" : ""
          }`}
          onClick={() => setActiveBtn3Profile("Follower")}
          style={{ color: text_clrM }}
        >
          <small> For Follower</small>
        </button>
        <button
          className={`btn border p-1 ps-3 pe-3 rounded-5 ${
            activeBtn3Profile === "Paid" ? "btn-dark" : ""
          }`}
          onClick={() => setActiveBtn3Profile("Paid")}
          disabled={true}
          style={{ color: text_clrM }}
        >
          <small>Paid Only</small>
        </button>
      </div>

      <div className="">
        <div className="d-flex gap-2 align-items-center  pb-0 pt-3">
          <div
            className="d-flex fw-semibold text-white rounded-5 align-items-center justify-content-center"
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
            <small style={{ color: "#888" }}>
              Visibility: {activeBtn3Profile}
            </small>
          </div>
        </div>
        <div className="mt-2">
          <textarea
            value={text}
            onChange={(e) => {
              handleInput(0, e, "text");
            }}
            className={`form-control rounded-0 shadow-none ps-1 pe-2`}
            placeholder="Write about post here . . ."
            style={{
              background: mainbg,
              color: text_clrM,
              minHeight: `${text.split("\n").length * 22}px`,
              border: `${error ? "1px solid red" : "0"}`,
            }}
            spellCheck="false"
          />
        </div>
      </div>

      <div className="d-flex gap-3 pt-2 justify-content-end p-0 pb-5 mb-4">
        <label
          htmlFor="images"
          className="btn  ps-3 pe-3 rounded-0 p-2"
          style={{
            height: "42px",
            border: `1px solid ${text_clrL}`,
            color: text_clrM,
          }}
          disabled={true}
        >
          Set as Status
        </label>

        <button
          type={LazyLoading ? "button" : "submit"}
          className="btn btn-danger flex-grow-1 rounded-0"
          style={{ height: "42px" }}
          disabled={LazyLoading}
          onClick={handleSubmit}
        >
          {LazyLoading ? <Loading clr={"white"} /> : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CanvasVibeEditor;
