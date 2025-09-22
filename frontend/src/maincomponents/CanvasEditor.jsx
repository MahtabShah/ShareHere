import React, { useState, useRef, useEffect, act } from "react";
import { toPng } from "html-to-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Rnd } from "react-rnd";
import { useQuote } from "../context/QueotrContext";
import { Loading } from "../../TinyComponent/LazyLoading";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Accordion from "react-bootstrap/Accordion";

import Tabs from "react-bootstrap/esm/Tabs";
import { Tab } from "bootstrap";

import {
  faTextHeight,
  faImage,
  faTrash,
  faArrowUp,
  faUpload,
  faBold,
  faItalic,
  faArrowsUpDownLeftRight,
  faUnderline,
  faAlignLeft,
  faAlignCenter,
  faPenNib,
  faAlignRight,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

import {
  FaStrikethrough,
  FaFont,
  FaTextHeight,
  FaArrowsAltH,
  FaTrash,
} from "react-icons/fa";

import {
  categories,
  letterSpacing,
  color,
  fontFamily,
  fontSize,
  pre_bg_color,
  textDecoration,
  textShadow,
  boxShadow,
} from "../StanderdThings/StanderdData";

import { useTheme } from "../context/Theme";

import {
  FaMagic, // For visual effects like shadows/glow
} from "react-icons/fa";

const CanvasVibeEditor = () => {
  const [elements, setElements] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  const [canvasHeight, setCanvasHeight] = useState(
    Math.min(window.innerHeight - 140, 500)
  );
  const [canvasBgColor, setCanvasBgColor] = useState("#1c81b7ff");
  const [exporting, setExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState(null);
  const [active_style, setActive_style] = useState(fontFamily);
  const [style_type, setStyle_type] = useState("fontFamily");
  const [count, setCount] = useState(0);
  const [category, setCategory] = useState("all");
  const [hidePage, setHidePage] = useState("");

  const canvasRef = useRef(null);
  const nevigate = useNavigate();
  const {
    admin_user,
    setUploadClicked,
    sm_break_point,
    mobile_break_point,
    API,
    token,
    setopenSlidWin,
    setActiveIndex,
  } = useQuote();

  useEffect(() => {
    setActiveIndex("Upload");
    if (!elements.length) {
      addTextBox();
    }
  }, []);

  let idCounter =
    elements.length > 0 ? Math.max(...elements.map((el) => el.id)) + 1 : 1;

  const addTextBox = () => {
    const newText = {
      id: idCounter++,
      type: "text",
      content: "write here...",
      x: 50,
      y: 50,
      width: 400,
      height: 400,
      fontSize: 18,
      fontFamily: "Arial",
      color: "#a6e9f1",
      zIndex: elements.length + 1,
      fontWeight: "normal",
      fontStyle: "italic",
      textDecoration: "none",
      background: "00000000",
      letterSpacing: "1",
      textAlign: "center",
      textShadow: "",
      backgroundPosition: "",
      range1: 0,
      range2: 0,
      borderRadius: 0,
    };
    setElements((prev) => [...prev, newText]);
    setActiveId(newText.id);
    setActiveElement(newText);
  };

  const handleChange = (id, key, value) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, [key]: value } : el))
    );

    setActiveElement((prev) => ({
      ...prev,
      [key]: value,
    }));

    console.log("val ", activeElement);
  };

  const setContinuousActiveId = () => {
    const len = elements.length;
    if (len > 0) {
      setActiveId(elements[count % len]?.id);
      setActiveElement(
        elements.find((el) => el.id === elements[count % len]?.id)
      );

      setCount(count + 1);
    }
  };

  const deleteElement = (id) => {
    const conf = window.confirm("want to delete this element !");
    if (conf) {
      setElements((prev) => prev.filter((el) => el.id !== id));
      setActiveId(elements[0] ? elements[0].id : null);
      setActiveElement(elements[0] ? elements[0] : null);
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

  // -----------------------------------posting-----------------------------
  const [visible, setVisible] = useState("Public");
  const [text, setText] = useState("");
  const [LazyLoading, setLazyLoading] = useState(false);
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
      console.log(e.target.value);
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
    setActiveId(null);
    setActiveElement({ id: "x" });

    try {
      const ready_url = await handleCapture();
      console.log("ready url ", ready_url);

      if (ready_url) {
        const res = await axios.post(
          `${API}/api/sentence/post`,
          {
            ready_url: ready_url,
            text: text,
            mode: visible,
            id: admin_user?._id,
            category: category,
          },
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

  const { text_clrH, text_clrL, text_clrM, mainbg, bg1, bg3, bg2 } = useTheme();

  const [styleOpen, setStyleOpen] = useState(false);

  const isResizing = useRef(false);

  const startResizing = () => {
    isResizing.current = true;
    // Mouse events
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
    // Touch events
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", stopResizing);
  };

  const handleMouseMove = (e) => {
    if (isResizing.current) {
      setCanvasHeight(
        e.clientY - canvasRef.current.getBoundingClientRect().top
      );
    }
  };

  const handleTouchMove = (e) => {
    if (isResizing.current) {
      e.preventDefault(); // prevent scrolling while resizing
      setCanvasHeight(
        e.touches[0].clientY - canvasRef.current.getBoundingClientRect().top
      );
    }
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", stopResizing);
  };

  const [statusLoading, setStatusLoading] = useState(false);
  const HandleStatus = async (e) => {
    // const [userId, setUserId] = useState(""); // use logged-in user ID
    // alert("Currently status feature is not availble. . . stay tuned !");
    // return;

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

    setActiveId(null);
    setActiveElement({ id: "x" });

    try {
      setStatusLoading(true);
      const ready_url = await handleCapture();
      const res = await axios.post(
        `${API}/api/crud/create_status`,
        {
          text: text,
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
    } finally {
      setStatusLoading(false);
    }
  };

  const [dir, setDir] = useState(window.innerWidth < 900);
  window.addEventListener("resize", () => {
    setDir(window.innerWidth < 900);
  });

  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);

  return (
    <div
      className="overflow-hidden d-flex w-100 pb-5"
      style={{
        flexDirection: dir ? "column" : "row",
        gap: "20px",
      }}
    >
      <div
        className="d-flex h-100"
        style={{
          maxWidth: "501px",
          minWidth: "min(501px , calc(100vw - 20px))",
          justifySelf: "center",
          margin: dir && "auto",
          // alignSelf: "",

          // border: `1px solid ${text_clrL}`,
        }}
      >
        <div className="card border-0">
          <div
            className={`position-fixed toolbar-pr p-2`}
            style={{
              zIndex: 1001,
              background: bg1,
              color: text_clrH,
              boxShadow: `0 1px 1px ${text_clrL}`,
              right: "0",
              left: `${
                mobile_break_point ? "0px" : sm_break_point ? "74px" : "244px"
              }`,

              right: 0,
            }}
          >
            <div className="d-flex gap-2 overflow-x-auto">
              <div
                className=" toolbar-button props-btn border-danger d-inline-flex p-1 rounded-1 bg-danger text-light"
                style={{
                  minWidth: "32px",
                  maxHeight: "32px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (window.confirm("The edit will be discard")) {
                    setopenSlidWin(false);
                    setActiveIndex(null);
                    navigate("/home");
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill={"white"}
                >
                  <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
              </div>

              <summary
                className="d-flex gap-2 h-100"
                style={{ color: "#ededed" }}
              >
                <div
                  className="toolbar-button props-btn "
                  style={{
                    wordSpacing: "pre-wrap",
                    minWidth: "max-content",
                  }}
                  onClick={() => {
                    setStyleOpen(!styleOpen);
                  }}
                >
                  &nbsp; {!styleOpen ? "open " : "close "} &nbsp;
                </div>
              </summary>

              <div className="d-flex overflow-x-auto  rounded-1 h-100 none-scroller gap-2 mb-1">
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
                    color={"#ededed"}
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
                    color={"#ededed"}
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
                    color={"#ededed"}
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
                    color={"#ededed"}
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
                    color={"#ededed"}
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
                    color={"#ededed"}
                  />
                </button>

                <div
                  className="d-flex gap-2 btn-tool overflow-x-auto none-scroller"
                  style={{ minWidth: "max-content" }}
                  onClick={() => {
                    setStyleOpen(true);
                  }}
                >
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
                    <FontAwesomeIcon icon={faPalette} title="Color" />
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

                <div
                  className="props-btn toolbar-button"
                  onClick={() => {
                    setStyleOpen(false);
                    setHidePage("CanvasHeight");
                  }}
                  style={{
                    cursor: "pointer",
                    minWidth: "max-content",
                  }}
                >
                  Canvas{" "}
                  <div
                    style={{
                      bottom: "-10px",
                      right: "1px",
                    }}
                  >
                    <FaArrowsAltH
                      style={{
                        color: text_clrL,
                        rotate: "90deg",
                      }}
                      size={16}
                    />
                  </div>
                </div>

                {activeElement?.type === "image" && (
                  <div
                    className="props-btn toolbar-button"
                    onClick={() => {
                      setStyleOpen(false);
                      setHidePage("objectPosition");
                    }}
                    style={{
                      cursor: "pointer",
                      minWidth: "max-content",
                    }}
                  >
                    Imagexy
                  </div>
                )}

                <div
                  className="props-btn toolbar-button"
                  onClick={() => {
                    setHidePage("borderRadius");
                    setStyleOpen(false);
                  }}
                  style={{
                    cursor: "pointer",
                    minWidth: "max-content",
                  }}
                >
                  Round
                </div>

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
                    onChange={(e) => {
                      e.stopPropagation();
                      handleChange(activeElement?.id, "color", e.target.value);
                    }}
                    defaultValue={"#ff0000"}
                    open
                  />
                </div>

                <div
                  className="props-btn toolbar-button"
                  style={{
                    border: `1px solid ${"#ededed"}`,
                    minWidth: "120px",
                  }}
                >
                  <div
                    className="btn overflow-hidden  d-flex align-items-center p-0 gap-1 rounded-0 justify-content-between  border-0"
                    style={{ translate: "6px" }}
                  >
                    <small className="flex-grow-1" style={{ color: "#ededed" }}>
                      Background
                    </small>
                    <div className="btn overflow-hidden flex-grow-1 props-btn rounded-0 p-0">
                      <input
                        type="color"
                        className="form-control form-control-color w-100 props-btn border"
                        style={{ scale: 3 }}
                        value={activeElement?.background}
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
                    border: `1px solid ${"#ededed"}`,
                    minWidth: "84px",
                  }}
                  disabled={!activeElement}
                  onClick={() => {
                    activeElement
                      ? handleChange(activeId, "background", "00000000")
                      : "";
                  }}
                >
                  &nbsp;Reset BG&nbsp;
                </button>
              </div>
            </div>

            {styleOpen && (
              <div className="d-flex gap-2 text-light mb-2 overflow-x-auto overflow-y-hidden none-scroller">
                {active_style.map((op) => (
                  <button
                    className={`props-btn toolbar-button ${
                      activeElement?.[style_type] == op ? "active" : ""
                    }`}
                    style={{
                      color: "#ededed",
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
                        color: "#ededed",
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
            )}

            <div className="position-sticky my-1 d-flex gap-2">
              <div className="" style={{ minWidth: "max-content" }}>
                <>
                  <div
                    className="d-flex flex-row-reverse props-parent flex-wrap gap-2 overflow-x-auto"
                    style={{
                      height: "max-content",
                    }}
                  >
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

              {elements?.length > 1 && (
                <>
                  <button
                    className={`toolbar-button ${
                      activeElement ? "active" : ""
                    }`}
                    onClick={() => bringToFront(activeElement?.id)}
                    disabled={!activeElement}
                    style={{ minWidth: "34px" }}
                  >
                    <FontAwesomeIcon icon={faArrowUp} color={"#ededed"} />
                  </button>
                  <button
                    className="btn props-btn toolbar-button"
                    onClick={() => {
                      setContinuousActiveId();
                    }}
                    style={{ minWidth: "max-content" }}
                  >
                    <b style={{ color: "#ededed" }}>Active</b>
                  </button>
                </>
              )}

              {activeId && (
                <>
                  <button
                    className={`btn toolbar-button`}
                    onClick={() => setActiveId(null)}
                    style={{
                      minWidth: "max-content",
                    }}
                    disabled={!activeElement}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>

                  <button
                    className={`btn  toolbar-button`}
                    onPointerDown={() => {
                      if (activeElement) {
                        deleteElement(activeElement?.id);
                      }
                    }}
                    disabled={!activeElement}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              )}

              <div
                className="d-flex gap-2 w-100 none-scroller overflow-x-auto overflow-y-hidden"
                style={{ maxHeight: "40px" }}
              >
                {pre_bg_color.map((c, idx) => {
                  return (
                    <span
                      key={`bg-${idx}`}
                      className="rounded-5 d-block"
                      style={{
                        minWidth: "30px",
                        minHeight: "30px",
                        background: `${c}`,
                        cursor: "pointer",
                        border: `${
                          canvasBgColor === c
                            ? "2px solid red"
                            : "2px solid #f9d8df00"
                        }`,
                      }}
                      onClick={() => {
                        setCanvasBgColor(c);
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {hidePage === "objectPosition" && (
              <>
                <div
                  className="position-absolute py-3 px-2 w-100 top-0 end-0 start-0 d-flex gap-2"
                  style={{ background: bg1, color: text_clrH }}
                >
                  <div className="d-flex flex-grow-1 w-100 flex-column">
                    <label className="w-100 d-flex gap-2 flex-grow-1 ">
                      X
                      <input
                        type="range"
                        id="rg1"
                        className="w-100"
                        min={-600}
                        max={600}
                        value={activeElement?.range1}
                        onChange={(e) => {
                          handleChange(
                            activeElement?.id,
                            "range1",
                            e.target.value
                          );
                        }}
                      />
                    </label>
                    <label className="w-100 d-flex gap-2">
                      Y
                      <input
                        type="range"
                        className="w-100 border"
                        id="rg2"
                        min={-1000}
                        max={1000}
                        value={activeElement?.range2}
                        onChange={(e) => {
                          handleChange(
                            activeElement?.id,
                            "range2",
                            e.target.value
                          );
                        }}
                      />
                    </label>
                  </div>

                  <div className="d-flex flex-column gap-1 align-items-center">
                    <div
                      className="btn btn-danger rounded-1 px-2 py-0 text-end"
                      onClick={() => {
                        setHidePage("");
                        setStyleOpen(false);
                      }}
                    >
                      Close
                    </div>

                    <div
                      className="btn btn-dark rounded-1 px-2 py-0 text-end"
                      onClick={() => {
                        handleChange(activeElement?.id, "range1", 0);

                        handleChange(activeElement?.id, "range2", 0);
                      }}
                    >
                      Reset
                    </div>
                  </div>
                </div>
              </>
            )}

            {hidePage === "borderRadius" && (
              <>
                <div
                  className="position-absolute py-3 px-2 w-100 top-0 end-0 start-0 d-flex gap-2"
                  style={{ background: bg1 }}
                >
                  <div className="d-flex flex-grow-1 w-100 flex-column">
                    <label className="w-100 d-flex flex-column gap-2 flex-grow-1 ">
                      <span className="mb-1 fw-semibold">Round the border</span>
                      <input
                        type="range"
                        id="rg1"
                        className="w-100"
                        min={0}
                        max={400}
                        value={activeElement?.borderRadius}
                        onChange={(e) => {
                          handleChange(
                            activeElement?.id,
                            "borderRadius",
                            e.target.value
                          );
                        }}
                      />
                    </label>
                  </div>

                  <div className="d-flex flex-column gap-1 align-items-center">
                    <div
                      className="btn btn-danger rounded-1 px-2 py-0 text-end"
                      onClick={() => {
                        setHidePage("");
                        setStyleOpen(false);
                      }}
                    >
                      Close
                    </div>

                    <div
                      className="btn btn-dark rounded-1 px-2 py-0 text-end"
                      onClick={() => {
                        handleChange(activeElement?.id, "borderRadius", 0);
                      }}
                    >
                      Reset
                    </div>
                  </div>
                </div>
              </>
            )}

            {hidePage === "CanvasHeight" && (
              <>
                <div
                  className="position-absolute py-3 px-2 w-100 top-0 end-0 start-0 d-flex gap-2"
                  style={{ background: bg1 }}
                >
                  <div className="d-flex flex-grow-1 w-100 flex-column">
                    <label className="w-100 d-flex flex-column gap-2 flex-grow-1 ">
                      <span className="mb-1 gap-2 d-inline-flex fw-semibold">
                        <span style={{ minWidth: "max-content" }}>
                          Set Canvas Height :
                        </span>
                        <input
                          className="border rounded-1 px-1 w-100"
                          type="number"
                          placeholder="Set height"
                          name=""
                          min={0}
                          value={canvasHeight || 0}
                          onChange={(e) => {
                            setCanvasHeight(e.target.value);
                          }}
                          id=""
                        />
                      </span>

                      <input
                        type="range"
                        id="ch1"
                        className="w-100"
                        min={0}
                        max={700}
                        value={canvasHeight}
                        onChange={(e) => {
                          setCanvasHeight(e.target.value);
                        }}
                      />
                    </label>
                  </div>

                  <div className="d-flex flex-column gap-1 align-items-center">
                    <div
                      className="btn btn-danger rounded-1 px-2 py-0 text-end"
                      onClick={() => {
                        setHidePage("");
                        setStyleOpen(false);
                      }}
                    >
                      Close
                    </div>

                    <div
                      className="btn btn-dark rounded-1 px-2 py-0 text-end"
                      onClick={() => {
                        setCanvasHeight(400);
                      }}
                    >
                      Reset
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          className="position-relative mx-2"
          style={{
            marginTop: `calc(52px + ${styleOpen ? `80px` : "44px"})`,
            width: "100%",
          }}
        >
          <UploadButton onSelect={(url) => setImageUrl(url)} url={imageUrl} />

          <div
            ref={canvasRef}
            className="canvas-container w-100 position-relative"
            style={{
              height: `${canvasHeight}px`,
              minHeight: "max-content",
              background: canvasBgColor,
              backgroundImage: `url(${imageUrl || ""})`,
              overflow: "hidden",
              maxWidth: "601px",
              // margin: "auto",
              backgroundSize: "100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
            }}
          >
            {elements.map((el, idx) => (
              <div
                key={`${el.id}-${idx}`}
                style={{
                  position: "relative",
                  zIndex: el.zIndex,
                  border:
                    activeId === el.id
                      ? "2px dashed #13da2aff"
                      : "2px solid transparent",
                }}
                spellCheck={false}
              >
                <div
                  className="text-element h-100 w-100 overflow-hidden outline-none w-100 h-100 none-scroller p-2"
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
                    outline: "none",
                    borderRadius: `${el.borderRadius}px`,
                    minHeight: `${activeId && "40px"}`,
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setActiveId(el.id);
                    setActiveElement(el);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    setActiveId(el.id);
                    setActiveElement(el);
                  }}
                  contentEditable={activeId === el.id}
                  suppressContentEditableWarning={true}
                >
                  {el.content}
                </div>
              </div>
            ))}

            {elements.length === 0 && !imageUrl && (
              <div className="empty-canvas w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white-50">
                <h4>Add text or images to get started</h4>
                <p className="text-center">
                  Click the buttons below to add elements
                </p>
              </div>
            )}
          </div>

          <div
            onTouchStart={startResizing}
            onMouseDown={startResizing}
            className="position-absolute"
            style={{
              cursor: "pointer",
              minWidth: "max-content",
              bottom: "-14px",
              right: "10px",
              zIndex: 100,
              cursor: "ns-resize",
            }}
          >
            <FaArrowsAltH
              style={{
                color: "red",
                rotate: "90deg",
              }}
              size={26}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          background: bg2,
          maxWidth: !dir ? "80%" : "100%",
          marginTop: !dir && `calc(52px + ${styleOpen ? `80px` : "44px"})`,
          padding: dir && "24px",
        }}
      >
        <Visiblity
          visible={visible}
          setVisible={setVisible}
          clr={bg1}
          bg={text_clrH}
        />

        <div className="px-2">
          <div className="d-flex gap-2 align-items-center  pb-0 pt-3">
            <div
              className="d-flex fw-semibold text-white rounded-5 align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: `${admin_user?.bg_clr}`,
                color: text_clrH,
              }}
            >
              {admin_user?.username?.charAt(0) || "M"}
            </div>
            <div>
              <div style={{ fontWeight: "bold", color: text_clrH }}>
                @{admin_user?.username || "Mahtab"}
              </div>
              <small style={{ color: text_clrM }}>Visibility: {visible}</small>
            </div>
          </div>
          <div className="mt-2 h-100">
            <textarea
              value={text}
              onChange={(e) => {
                handleInput(0, e, "text");
              }}
              className={`form-control rounded h-100 shadow-none p-2 overflow-auto none-scroller`}
              placeholder="Write about post here . . ."
              style={{
                background: bg2,
                color: text_clrH,
                minHeight: `${(text.split("\n").length + 4) * 27}px`,
                border: `${error ? "1px solid red" : `1px solid ${text_clrL}`}`,
              }}
              spellCheck="false"
            />
          </div>
        </div>

        <div className="p-2 small" style={{ color: text_clrH }}>
          Set Tag for the post :{" "}
        </div>
        <div className="vibeTabs px-2">
          <Tabs
            id="controlled-tab-example"
            activeKey={category}
            onSelect={(k) => setCategory(k)}
            className="border-0 d-flex gap-3 py-2 flex-nowrap none-scroller overflow-auto"
            transition={false}
            style={{
              "--bg1": bg1,
              "--bg2": bg2,
              "--tc1": text_clrH,
              "--tc2": text_clrM,
              maxWidth: !dir
                ? `calc(100vw - 541px - ${
                    mobile_break_point
                      ? "0px"
                      : sm_break_point
                      ? "74px"
                      : "244px"
                  })`
                : "100%",

              // maxWidth: "400px",

              // gridTemplateColumns: "repeat(auto-fit , minmax(100px, 1fr))",
            }}
          >
            {categories.map(({ key, title }) => (
              <Tab
                eventKey={key}
                title={title}
                className="border-0"
                key={key}
              />
            ))}
          </Tabs>
        </div>

        <div className="d-flex gap-3 p-2 justify-content-end p-0 pb-5 mb-4">
          <label
            htmlFor="images"
            className="btn  ps-3 pe-3 rounded-0 p-2"
            style={{
              height: "42px",
              border: `1px solid ${"#959595ff"}`,
              color: text_clrM,
            }}
            onClick={HandleStatus}
          >
            {statusLoading ? <Loading clr={"red"} /> : "Set as Status"}
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
    </div>
  );
};

export function UploadButton({ onSelect, url }) {
  const fileInputRef = useRef(null);

  // File select karte hi URL generate
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onSelect(imageUrl); // parent component ko image url bhejo
    }
  };

  return (
    <>
      {/* Upload button */}
      <div
        // click se file input open
        className="position-absolute rounded-5 d-flex justify-content-center align-items-center top-0 end-0"
        style={{
          zIndex: 99,
          height: "32px",
          width: "32px",
          cursor: "pointer",
          background: "hsla(177, 37%, 67%, 0.76)",
        }}
      >
        {url ? (
          <div onClick={() => onSelect(null)}>
            <FontAwesomeIcon icon={faTrash} color="white" />
          </div>
        ) : (
          <div onClick={() => fileInputRef.current.click()}>
            <FontAwesomeIcon icon={faUpload} color="white" />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}

export function Visiblity({ visible, setVisible, clr, bg }) {
  // Privacy options ka array
  const privacyOptions = [
    { value: "Public", label: "For Public", disabled: false },
    { value: "Follower", label: "For Follower", disabled: false },
    { value: "Paid", label: "Paid Only", disabled: true },
  ];

  return (
    <div className="d-flex flex-column mb-3 pt-2 align-items-center">
      <div className="px-2 small" style={{ color: bg }}>
        Set Visibility, who can see your post ? :
      </div>

      <div className="d-flex gap-3 p-2">
        {privacyOptions.map((option) => {
          const isActive = visible === option.value;

          return (
            <button
              key={option.value}
              className="btn border p-1 ps-2 pe-2 rounded-5"
              onClick={() => setVisible(option.value)}
              disabled={option.disabled}
              style={{
                color: isActive && clr,
                background: isActive && bg,
                cursor: option.disabled ? "not-allowed" : "pointer",
                opacity: option.disabled ? 0.6 : 1,
              }}
            >
              <small>{option.label}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// export const CanvasVibeEditor = () => {
//   const { text_clrH, text_clrL, text_clrM, mainbg, bg1, bg3, bg2 } = useTheme();

//   const parentStyle = {
//     backgroundColor: mainbg,
//     borderRadius: "8px",
//   };

//   // Expanded toolbar options like MS Word
//   const toolbarOptions = [
//     // File operations[]
//     [
//       // {
//       //   icon: faFile,
//       //   op: "new",
//       //   title: "New Document",
//       //   group: "file",
//       //   line: 1,
//       // },
//       // { icon: faFolderOpen, op: "open", title: "Open", group: "file", line: 1 },
//       // { icon: faSave, op: "save", title: "Save", group: "file", line: 1 },

//       // Undo/Redo
//       { icon: faUndo, op: "undo", title: "Undo", group: "edit", line: 1 },
//       { icon: faRedo, op: "redo", title: "Redo", group: "edit", line: 1 },

//       { type: "color", op: "foreColor", title: "Text Color", group: "color" },
//       {
//         type: "color",
//         op: "backColor",
//         title: "Background Color",
//         group: "color",
//         line: 2,
//       },
//       // Font family and size
//       {
//         type: "select",
//         op: "fontFamily",
//         title: "Font Family",
//         options: ["Arial", "Times New Roman", "Calibri", "Georgia", "Verdana"],
//         group: "font",
//         line: 1,
//       },

//       {
//         type: "select",
//         op: "fontSize",
//         title: "Font Size",
//         options: ["8", "10", "12", "14", "16", "18", "24", "36"],
//         group: "font",
//         line: 1,
//       },
//     ],

//     // Text formatting
//     [
//       // Colors

//       {
//         icon: faBold,
//         op: "bold",
//         style_type: "fontWeight",
//         title: "Bold",
//         group: "format",
//         line: 2,
//       },
//       {
//         icon: faItalic,
//         op: "italic",
//         style_type: "fontStyle",
//         title: "Italic",
//         group: "format",
//         line: 2,
//       },
//       {
//         icon: faUnderline,
//         op: "underline",
//         style_type: "textDecoration",
//         title: "Underline",
//         group: "format",
//         line: 2,
//       },
//       {
//         icon: faStrikethrough,
//         op: "strikethrough",
//         style_type: "textDecoration",
//         title: "Strikethrough",
//         group: "format",
//         line: 2,
//       },

//       // Alignment
//       {
//         icon: faAlignLeft,
//         op: "justifyLeft",
//         style_type: "textAlign",
//         title: "Align Left",
//         group: "paragraph",
//         line: 2,
//       },
//       {
//         icon: faAlignCenter,
//         op: "justifyCenter",
//         style_type: "textAlign",
//         title: "Center",
//         group: "paragraph",
//         line: 2,
//       },
//       {
//         icon: faAlignRight,
//         op: "justifyRight",
//         style_type: "textAlign",
//         title: "Align Right",
//         group: "paragraph",
//         line: 2,
//       },
//       {
//         icon: faAlignJustify,
//         op: "justifyFull",
//         style_type: "textAlign",
//         title: "Justify",
//         group: "paragraph",
//         line: 2,
//       },

//       // Lists
//       {
//         icon: faListUl,
//         op: "insertUnorderedList",
//         title: "Bullet List",
//         group: "paragraph",
//         line: 2,
//       },
//       {
//         icon: faListOl,
//         op: "insertOrderedList",
//         title: "Numbered List",
//         group: "paragraph",
//         line: 2,
//       },

//       // Indentation
//       {
//         icon: faIndent,
//         op: "indent",
//         title: "Increase Indent",
//         group: "paragraph",
//         line: 2,
//       },
//       {
//         icon: faOutdent,
//         op: "outdent",
//         title: "Decrease Indent",
//         group: "paragraph",
//         line: 2,
//       },
//     ],
//   ];

//   const headerStyle = {
//     backgroundColor: bg1,
//     // border: `1px solid red`,
//     borderBottom: `1px solid ${bg3}`,
//     padding: "8px 12px",
//     gap: "8px",
//     width: "100%",
//     alignItems: "center",
//     position: "fixed",
//     zIndex: 9990,
//     // display: "flex",
//     // flexWrap: "wrap",

//     // overflow: "auto",
//   };

//   const editorStyle = {
//     minHeight: "500px",
//     height: "70vh",
//     backgroundColor: mainbg,
//     caretColor: text_clrH,
//     outline: "none",
//     border: "none",
//     color: text_clrH,
//     padding: "16px",
//     lineHeight: "1.6",
//     fontSize: "14px",
//     fontFamily: "Calibri, Arial, sans-serif",
//     marginInline: "16px",
//   };

//   const groupStyle = {
//     display: "flex",
//     alignItems: "center",
//     gap: "2px",
//     padding: "3px 6px",
//     borderRadius: "4px",
//     backgroundColor: bg2,
//     marginRight: "7px",
//   };

//   const separatorStyle = {
//     width: "1px",
//     height: "24px",
//     backgroundColor: bg3,
//     margin: "0 8px",
//   };

//   const buttonStyle = {
//     border: "none",
//     backgroundColor: "transparent",
//     color: text_clrM,
//     padding: "5px 7px",
//     borderRadius: "3px",
//     cursor: "pointer",
//     minWidth: "32px",
//     fontSize: "12px",
//   };

//   const selectStyle = {
//     backgroundColor: bg2,
//     border: `1px solid ${bg3}`,
//     color: text_clrM,
//     borderRadius: "3px",
//     padding: "4px 8px",
//     fontSize: "12px",
//     outline: "none",
//   };

//   const onRef = useRef(null);
//   const [activeFormats, setActiveFormats] = useState({});
//   const [wordCount, setWordCount] = useState(0);
//   const [pageView, setPageView] = useState(true);

//   // Group toolbar items by their group
//   const groupedToolbar1 = toolbarOptions[0].reduce((groups, item) => {
//     if (!groups[item.group]) {
//       groups[item.group] = [];
//     }
//     groups[item.group].push(item);
//     return groups;
//   }, {});

//   const groupedToolbar2 = toolbarOptions[1].reduce((groups, item) => {
//     if (!groups[item.group]) {
//       groups[item.group] = [];
//     }
//     groups[item.group].push(item);
//     return groups;
//   }, {});

//   const groupedToolbarArray = [groupedToolbar1, groupedToolbar2];

//   const handleCommand = (command, value = null) => {
//     document.execCommand(command, false, value);
//     onRef.current?.focus();
//     updateActiveFormats();
//   };

//   const updateActiveFormats = () => {
//     if (!onRef.current) return;

//     const formats = {
//       bold: document.queryCommandState("bold"),
//       italic: document.queryCommandState("italic"),
//       underline: document.queryCommandState("underline"),
//       strikethrough: document.queryCommandState("strikethrough"),
//     };
//     setActiveFormats(formats);
//   };

//   const handleInput = () => {
//     updateActiveFormats();
//     if (onRef.current) {
//       const text = onRef.current.innerText || "";
//       const words = text.trim() ? text.trim().split(/\s+/).length : 0;
//       setWordCount(words);
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const text = e.clipboardData.getData("text/plain");
//     document.execCommand("insertText", false, text);
//   };

//   const togglePageView = () => {
//     setPageView(!pageView);
//   };

//   return (
//     <div className={`d-flex flex-column`} style={{ ...parentStyle }}>
//       {/* Status Bar */}
//       {/* <div
//         style={{
//           backgroundColor: bg1,
//           padding: "4px 12px",
//           borderBottom: `1px solid ${bg3}`,
//           fontSize: "12px",
//           color: text_clrL,
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <span>Words: {wordCount}</span>
//         <div>
//           <button
//             style={{ ...buttonStyle, fontSize: "10px" }}
//             onClick={togglePageView}
//           >
//             {pageView ? "Web Layout" : "Print Layout"}
//           </button>
//         </div>
//       </div> */}

//       {/* Toolbar */}
//       <div className="px-3" style={{ ...headerStyle }}>
//         {groupedToolbarArray.map((groupedToolbar, items) => (
//           <div className="d-flex overflow-auto none-scroller pb-1" key={items}>
//             {Object.entries(groupedToolbar).map(([groupName, items]) => (
//               <div key={groupName} style={groupStyle}>
//                 {items.map((item, idx) => {
//                   if (item.type === "select") {
//                     return (
//                       <select
//                         key={item.op}
//                         style={selectStyle}
//                         onChange={(e) => handleCommand(item.op, e.target.value)}
//                         title={item.title}
//                       >
//                         <option value="">{item.title}</option>
//                         {item.options.map((opt) => (
//                           <option key={opt} value={opt}>
//                             {opt}
//                           </option>
//                         ))}
//                       </select>
//                     );
//                   } else if (item.type === "color") {
//                     return (
//                       <button
//                         key={item.op}
//                         style={{
//                           ...buttonStyle,
//                           color: activeFormats[item.op] ? text_clrH : text_clrM,
//                         }}
//                         onClick={() => {
//                           const color = prompt(
//                             `Enter ${item.title}:`,
//                             "#000000"
//                           );
//                           if (color) handleCommand(item.op, color);
//                         }}
//                         title={item.title}
//                       >
//                         <FontAwesomeIcon
//                           icon={item.icon || faPalette}
//                           fontSize={14}
//                         />
//                       </button>
//                     );
//                   } else {
//                     return (
//                       <button
//                         key={item.op}
//                         style={{
//                           ...buttonStyle,
//                           color: activeFormats[item.op] ? text_clrH : text_clrM,
//                           backgroundColor: activeFormats[item.op]
//                             ? text_clrL
//                             : "transparent",
//                         }}
//                         onClick={() => handleCommand(item.op)}
//                         title={item.title}
//                       >
//                         <FontAwesomeIcon icon={item.icon} fontSize={14} />
//                       </button>
//                     );
//                   }
//                 })}
//                 {/* <div style={separatorStyle} /> */}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>

//       {/* Editor Area */}
//       <div
//         className="py-3"
//         style={{
//           backgroundColor: bg2,
//           marginTop: "90px",
//           minHeight: "max-content",
//         }}
//       >
//         <div
//           ref={onRef}
//           contentEditable
//           style={{
//             ...editorStyle,
//             backgroundColor: pageView ? bg3 : mainbg,
//             minHeight: pageView ? "calc(70vh - 80px)" : "500px",
//             boxShadow: pageView ? "0 0 0 1px rgba(0,0,0,0.1)" : "none",
//             // margin: "0 auto",
//             maxWidth: pageView ? "8.5in" : "100%",
//             caretColor: "red",
//             maxWidth: "500px",
//             minHeight: "max-content",
//           }}
//           spellCheck="false"
//           className="word-editor"
//           onInput={handleInput}
//           onKeyUp={handleInput}
//           onPaste={handlePaste}
//           onFocus={updateActiveFormats}
//           data-gramm="false"
//         />
//       </div>
//     </div>
//   );
// };

// // You'll need these additional FontAwesome imports:
import {
  faFile,
  faFolderOpen,
  faSave,
  faStrikethrough,
  faAlignJustify,
  faListUl,
  faListOl,
  faIndent,
  faOutdent,
  faUndo,
  faRedo,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

export default CanvasVibeEditor;
