import React, { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Rnd } from "react-rnd";
import { useQuote } from "../context/QueotrContext";
import { Loading } from "../../TinyComponent/LazyLoading";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
import axios from "axios";
import { Route, useNavigate } from "react-router-dom";
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
  faDownload,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";

import {
  FaBold,
  FaItalic,
  FaImage,
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

import { useTheme } from "../context/Theme";

const CanvasVibeEditor = () => {
  const [elements, setElements] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [canvasHeight, setCanvasHeight] = useState(400);
  const [canvasBgColor, setCanvasBgColor] = useState("#aaffcc");
  const [exporting, setExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState(null);
  const canvasRef = useRef(null);
  const nevigate = useNavigate();

  let idCounter =
    elements.length > 0 ? Math.max(...elements.map((el) => el.id)) + 1 : 1;

  const addTextBox = () => {
    const newText = {
      id: idCounter++,
      type: "text",
      // content: `

      //                                     `,
      content: "Type Here",
      x: 50,
      y: 50,
      width: 100,
      height: 60,
      fontSize: 28,
      fontFamily: "Arial",
      color: "#f40707",
      // shadow: "2px 2px 4px rgba(0,0,0,0.5)",
      zIndex: elements.length + 1,
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "left",
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

  const [count, setCount] = useState(0);

  const setContinuousActiveId = () => {
    const len = elements.length;
    if (len > 0) {
      setActiveId(elements[count % len]?.id);
      setCount(count + 1);
    }
  };

  const deleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setContinuousActiveId();
  };

  const bringToFront = (id) => {
    setElements((prev) => {
      const maxZIndex = Math.max(...prev.map((el) => el.zIndex), 0);
      return prev.map((el) =>
        el.id === id ? { ...el, zIndex: maxZIndex + 1 } : el
      );
    });
  };

  const applyFontStyle = (id, style, value) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, [style]: value } : el))
    );
  };

  const DragcanvasRef = useRef(null);

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
  const textareaRef = useRef(null);
  const [text, setText] = useState("");
  const [LazyLoading, setLazyLoading] = useState(false);
  const [bg_clr, setbg_clr] = useState("#dff");

  const { style, admin_user, uploadClicked, setUploadClicked, sm_break_point } =
    useQuote();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin_user) {
      nevigate("/login") || nevigate("/signup");
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
        nevigate("/home");
      }
    } catch (err) {
      alert(
        "Failed to save sentence: " +
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

    // handleChange(activeElement?.id, "content", outerDivRef.current.textContent);
  }, []);

  const outerDivRef = useRef(null);
  const txtareaRef = useRef(null);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    if (outerDivRef.current) {
      outerDivRef.current.scrollTop = scrollTop;
    }
  };

  const isSyncing = useRef(false); // To avoid infinite loop

  // Sync scrolls both ways
  const syncScroll = (source, target) => {
    if (!isSyncing.current) {
      isSyncing.current = true;
      target.scrollTop = source.scrollTop;
      setTimeout(() => {
        isSyncing.current = false;
      }, 0);
    }
  };

  return (
    <div className="shadow-lg" style={{ background: mainbg }}>
      <div className="">
        {/* <div className="row">
          <div className="col-12 ms-2">
            <h1 className="display-5 fw-bold ">
              <FontAwesomeIcon icon={faExpand} className="me-2" />
              VIBE Canva Editor
            </h1>
            <p className="lead">
              Create stunning posts and export them as VIBE
            </p>
          </div>
        </div> */}

        <div className="p-1 pt-0">
          <div className="d-flex">
            <div
              className="card border-0 shadow-sm "
              style={{ background: mainbg }}
            >
              <div className="card border-0 shadow-sm position-sticky">
                {/* <div
                  className="card-header d-flex ps-0 pt-0 mt-0 justify-content-between align-items-center rounded-0"
                  style={{
                    background: mainbg,
                    color: text_clrM,
                  }}
                >
                  <strong>
                    {activeElement?.type === "text"
                      ? "Text Properties acitvated"
                      : "Image Properties acitvated"}
                  </strong>
                </div> */}
                <div
                  className="py-2 positio-fixed"
                  // style={{ border: "2px solid red" }}
                  style={{ background: mainbg }}
                >
                  <>
                    <div
                      className="d-flex props-parent flex-wrap gap-2 overflow-x-auto format-toolbar"
                      style={{
                        height: "max-content",
                      }}
                    >
                      <div>
                        <div
                          className="btn d-flex gap-2 align-items-center props-btn toolbar-button"
                          style={{ border: `1px solid ${text_clrL}` }}
                        >
                          <FontAwesomeIcon
                            icon={faTextHeight}
                            color={text_clrM}
                            fontSize={12}
                          />

                          <input
                            type="number"
                            className="ps-1 border-0 rounded-1 flex-grow-1"
                            name="textHeight"
                            id="textHeight"
                            min="8"
                            max="120"
                            value={activeElement?.fontSize || 28}
                            style={{
                              width: "34px",
                              fontSize: "14px",
                              background: "transparent",
                              color: text_clrM,
                            }}
                            onChange={(e) =>
                              handleChange(
                                activeElement?.id,
                                "fontSize",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>

                      <div
                        className="d-flex  props-btn overflow-hidden toolbar-button"
                        style={{ border: `1px solid ${text_clrL}` }}
                      >
                        {/* <FaFont size={12} color={text_clrM} /> */}
                        <select
                          className="form-select shadow-none border-0 props-btn"
                          value={activeElement?.fontFamily}
                          style={{
                            background: "transparent",
                            color: text_clrM,
                          }}
                          onChange={(e) =>
                            handleChange(
                              activeElement?.id,
                              "fontFamily",
                              e.target.value
                            )
                          }
                        >
                          <option
                            value="Arial"
                            style={{ background: text_clrL }}
                          >
                            Arial
                          </option>
                          <option
                            value="Georgia"
                            style={{ background: text_clrL }}
                          >
                            Georgia
                          </option>
                          <option
                            value="Courier New"
                            style={{ background: text_clrL }}
                          >
                            Courier New
                          </option>
                          <option
                            value="Times New Roman"
                            style={{ background: text_clrL }}
                          >
                            Times New Roman
                          </option>
                          <option
                            value="Verdana"
                            style={{ background: text_clrL }}
                          >
                            Verdana
                          </option>
                          <option
                            value="Impact"
                            style={{ background: text_clrL }}
                          >
                            Impact
                          </option>
                        </select>
                      </div>

                      <button
                        className={`toolbar-button   ${
                          activeElement?.fontWeight === "bold" ? "active" : ""
                        }`}
                        onClick={() =>
                          handleChange(
                            activeElement?.id,
                            "fontWeight",
                            activeElement?.fontWeight === "bold"
                              ? "normal"
                              : "bold"
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
                        style={{ border: `` }}
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
                        style={{ border: `` }}
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
                        style={{ border: `` }}
                        onClick={() =>
                          handleChange(activeElement?.id, "textAlign", "center")
                        }
                        disabled={!activeElement}
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
                        style={{ border: `` }}
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
                            handleChange(
                              activeElement?.id,
                              "color",
                              e.target.value
                            )
                          }
                          defaultValue={"#ff0000"}
                        />
                      </div>

                      <div
                        className="props-btn toolbar-button"
                        style={{
                          border: `1px solid ${text_clrL}`,
                          width: "120px",
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
                              value={canvasBgColor}
                              onChange={(e) => setCanvasBgColor(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className="d-flex gap-2 btn p-0 toolbar-button"
                        style={{
                          border: `1px solid ${text_clrL}`,
                          width: "120px",
                        }}
                      >
                        <label
                          className="small d-flex align-items-center flex-grow-1 ps-2"
                          style={{
                            color: text_clrM,
                          }}
                        >
                          Height{" "}
                        </label>
                        <input
                          type="number"
                          className=" props-btn ps-2 p-0 border-0"
                          style={{
                            // minWidth: "40px",
                            background: "transparent",
                            color: text_clrM,
                          }}
                          value={canvasHeight}
                          onChange={(e) =>
                            setCanvasHeight(parseInt(e.target.value))
                          }
                        />
                      </div>

                      <div className="d-flex gap-2">
                        <button className="btn overflow-hidden btn-success props-btn rounded-0 p-0">
                          <label className="btn btn-success props-btn gap-2 rounded-0">
                            Add{" "}
                            <FontAwesomeIcon icon={faImage} color={text_clrH} />
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
                            <FontAwesomeIcon
                              icon={faTextHeight}
                              className="me-2"
                            />
                          </div>
                        </button>

                        <button
                          className="btn props-btn toolbar-button"
                          onClick={() => {
                            setContinuousActiveId();
                          }}
                          style={{ border: `1px solid ${text_clrL}` }}
                        >
                          <b style={{ color: text_clrM }}>Active</b>
                        </button>

                        <button
                          className={`toolbar-button ${
                            activeElement ? "active" : ""
                          }`}
                          onClick={() => bringToFront(activeElement?.id)}
                          disabled={!activeElement}
                        >
                          <FontAwesomeIcon icon={faArrowUp} color={text_clrM} />
                        </button>

                        <button
                          className={`btn props-btn toolbar-button ${
                            activeElement ? "active" : ""
                          }`}
                          onClick={() => setActiveId(null)}
                          style={{ border: `1px solid ${text_clrL}` }}
                          disabled={!activeElement}
                        >
                          <b style={{ color: text_clrM }}>- / -</b>
                        </button>

                        <button
                          className={`btn  toolbar-button ${
                            activeElement ? "active" : ""
                          }`}
                          onPointerDown={() => deleteElement(activeElement?.id)}
                          disabled={!activeElement}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>

                        {/* <button
                          // onClick={() => item.action ? item.action() : handleToggle(item)}
                          className={`
               
                ${
                  item.type === "toggle" &&
                  formatting[item.property] === (item.value || item.activeValue)
                    ? "active"
                    : ""
                }
              `}
                          title={item.label}
                        >
                          {item.icon && <FontAwesomeIcon icon={item.icon} />}
                          {!item.icon && item.label}
                        </button> */}
                      </div>
                    </div>

                    {/* 
                      <div className="d-flex gap-2 small flex-wrap">
                        <div className="mb-3 flex-grow-1">
                          <label className="form-label">Text Shadow</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. 2px 2px 4px #000"
                            value={activeElement?.shadow}
                            onChange={(e) =>
                              handleChange(
                                activeElement?.id,
                                "shadow",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div> */}
                  </>

                  {/* <div className="mt-2">
                    <textarea
                      className="form-control h-100 w-100"
                      value={activeElement?.content}
                      style={{
                        background: mainbg,
                        color: text_clrM,
                        border: `1px solid ${text_clrL}`,
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
                      {activeElement.content}
                    </textarea>
                  </div> */}

                  <div className="mt-2">
                    <input
                      type="range"
                      min={100}
                      max={800}
                      step={10}
                      onChange={(e) =>
                        setCanvasHeight(parseInt(e.target.value))
                      }
                      style={{ height: "7px" }}
                      className="w-100 "
                    />
                  </div>
                </div>
              </div>

              <div>
                <div
                  className="card-body p-0"
                  style={{
                    maxWidth: "600px",
                    margin: "auto",
                    background: mainbg,
                  }}
                >
                  <div
                    ref={canvasRef}
                    className="canvas-container"
                    style={{
                      height: `${canvasHeight}px`,
                      background: canvasBgColor,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {elements.map((el) => (
                      <Rnd
                        key={el.id}
                        style={{
                          // position: "absolute",
                          left: `${el.x}px`,
                          top: `${el.y}px`,
                          width: `${el.width}px`,
                          height: `${el.height}px`,
                          zIndex: el.zIndex,
                          border:
                            activeId === el.id ? "2px dashed #0d6efd" : "none",
                          boxShadow:
                            activeId === el.id
                              ? "0 0 10px rgba(13, 110, 253, 0.5)"
                              : "none",
                          cursor: "move",
                        }}
                        spellCheck={false}
                        disableDragging={
                          activeElement?.id == el.id ? false : true
                        }
                        onClick={() => {
                          setActiveId(el.id);
                        }}
                        //
                        //
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
                                className="btn text-danger btn-sm p-0 position-absolute top-0 end-0 rounded"
                                style={{ zIndex: 1000, width: "20px" }}
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                  deleteElement(el.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} color="red" />
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
                              className="text-element outline-none w-100 h-100 none-scroller p-2"
                              style={{
                                fontSize: `${el.fontSize}px`,
                                color: el.color,
                                fontFamily: el.fontFamily,
                                textShadow: el.shadow,
                                fontWeight: el.fontWeight,
                                fontStyle: el.fontStyle,
                                textDecoration: el.textDecoration,
                                textAlign: el.textAlign,
                                overflow: "auto",
                                whiteSpace: "pre-wrap",
                              }}
                              ref={outerDivRef}
                              contentEditable
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
                              onInput={(e) => {
                                console.log(e.target.innerText);
                              }}
                            >
                              {el.content}
                            </div>
                          ) : (
                            <div className="overflow-hidden h-100 w-100">
                              <img
                                src={el.src}
                                alt="uploaded"
                                className="image-element w-100"
                                draggable={false}
                                style={{ objectFit: "contain" }}
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

                {/* <>
                  <div className="mb-3">
                    <label className="form-label">Replace Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          URL.revokeObjectURL(activeElement?.src);
                          const url = URL.createObjectURL(e.target.files[0]);
                          handleChange(activeElement?.id, "src", url);
                        }
                      }}
                    />
                  </div>
                </> */}
              </div>
            </div>

            {/* {exportUrl && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-success text-white">
                  Export Preview
                </div>
                <div className="card-body text-center">
                  <img
                    src={exportUrl}
                    alt="Exported design"
                    className="img-fluid mb-3 border rounded"
                    style={{ maxHeight: "300px" }}
                  />
                  <div>
                    <a
                      href={exportUrl}
                      download="canvas-design.png"
                      className="btn btn-success"
                    >
                      <FontAwesomeIcon icon={faDownload} className="me-2" />
                      Download Image
                    </a>
                  </div>
                </div>
              </div>
            )} */}
          </div>
          {/* 
          <div className="col-md-3">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <strong>Canvas Settings</strong>
              </div>
              <div className="card-body">
               
              </div>
            </div>
          </div> */}
        </div>

        {/* {elements.length <= 0 && (
          <div className="row mt-3 p-2">
            <div className="col-12">
              <div className="alert alert-info text-center">
                <p className="mb-0">
                  Select an element to customize its properties
                </p>
              </div>
            </div>
          </div>
        )} */}
      </div>

      <div
        className="d-flex gap-2 p-2 none-scroller overflow-x-auto overflow-y-hidden"
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

      <div className="d-flex gap-3 p-2">
        <button
          className={`btn border p-1 ps-2 pe-2 rounded-5 ${
            activeBtn3Profile === "public" ? "btn-dark" : ""
          }`}
          onClick={() => setActiveBtn3Profile("public")}
          style={{ color: text_clrM }}
        >
          For Public
        </button>
        <button
          className={`btn border p-1 ps-2 pe-2 rounded-5 ${
            activeBtn3Profile === "Follower" ? "btn-dark" : ""
          }`}
          onClick={() => setActiveBtn3Profile("Follower")}
          style={{ color: text_clrM }}
        >
          For Follower
        </button>
        <button
          className={`btn border p-1 ps-3 pe-3 rounded-5 ${
            activeBtn3Profile === "Paid" ? "btn-dark" : ""
          }`}
          onClick={() => setActiveBtn3Profile("Paid")}
          disabled={true}
          style={{ color: text_clrM }}
        >
          Paid Only
        </button>
      </div>

      <div className="">
        <div className="d-flex gap-2 align-items-center  pb-0 pt-3">
          <div
            className="d-flex fw-semibold ms-1 text-white rounded-5 align-items-center justify-content-center"
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
        <div className="mt-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              handleInput(0, e, "text");
            }}
            className={`form-control rounded-0 shadow-none ps-2 pe-2`}
            placeholder="Write about post here . . ."
            style={{
              overflow: "hidden",
              resize: "none",
              background: mainbg,
              color: text_clrM,
              border: `0px solid ${text_clrL}`,
            }}
            spellCheck="false"
            required
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
