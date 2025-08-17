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
  faBold,
  faItalic,
  faUnderline,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

import {
  FaStrikethrough,
  FaFont,
  FaTextHeight,
  FaArrowsAltH,
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
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight - 200);
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
    openSlidWin,
    setActiveIndex,
  } = useQuote();

  let idCounter =
    elements.length > 0 ? Math.max(...elements.map((el) => el.id)) + 1 : 1;

  const addTextBox = () => {
    const newText = {
      id: idCounter++,
      type: "text",
      content: "Type Here",
      x: 50,
      y: 50,
      width: 400,
      height: 400,
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
      range1: 0,
      range2: 0,
      borderRadius: 0,
    };
    setElements((prev) => [...prev, newText]);
    setActiveId(newText.id);
    setActiveElement(newText);
    setTextWriteOpen(true);
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
      range1: 0,
      range2: 0,
      borderRadius: 0,
    };
    setElements([...elements, newImage]);
    setActiveId(newImage.id);
    setHidePage("objectPosition");
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
  const [activeBtn3Profile, setActiveBtn3Profile] = useState("Public");
  const [text, setText] = useState("");
  const [LazyLoading, setLazyLoading] = useState(false);
  let touchStartTime = 0;
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
            mode: activeBtn3Profile,
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

  const [textWriteOpen, setTextWriteOpen] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);

  const preventToggle = (e) => {
    e.preventDefault(); // prevent summary default toggle
  };

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

  return (
    openSlidWin && (
      <div
        className="overflow-hidden"
        style={{
          background: bg2,
          maxWidth: "601px",
          zIndex: 98765432,
          margin: "auto",
        }}
      >
        <div className="">
          <div className="pt-0">
            <div className="d-flex ">
              <div className="card border-0">
                <div
                  className={`position-fixed toolbar-pr p-2`}
                  style={{
                    zIndex: 89899998765432,
                    background: bg1,
                    color: text_clrH,
                    boxShadow: `0 1px 1px ${text_clrL}`,
                    right: "0",
                    left: `${
                      mobile_break_point
                        ? "0px"
                        : sm_break_point
                        ? "74px"
                        : "245px"
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
                        setopenSlidWin(false);
                        setActiveIndex(null);
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
                            color: `${
                              active_style === fontFamily ? "#fff" : ""
                            }`,
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
                            color: `${
                              active_style === textShadow ? "#fff" : ""
                            }`,
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
                            color: `${
                              active_style === textDecoration ? "#fff" : ""
                            }`,
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
                            background: `${
                              active_style === color ? "#6b0ad2" : ""
                            }`,
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
                            color: `${
                              active_style === letterSpacing ? "#fff" : ""
                            }`,
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
                            color: `${
                              active_style === boxShadow ? "#fff" : ""
                            }`,
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
                            handleChange(
                              activeElement?.id,
                              "color",
                              e.target.value
                            );
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
                          <small
                            className="flex-grow-1"
                            style={{ color: "#ededed" }}
                          >
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
                            <FontAwesomeIcon
                              icon={faArrowUp}
                              color={"#ededed"}
                            />
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
                            className={`btn props-btn toolbar-button ${
                              activeElement ? "active" : ""
                            }`}
                            onClick={() => setActiveId(null)}
                            style={{
                              border: `1px solid ${"#ededed"}`,
                              minWidth: "max-content",
                            }}
                            disabled={!activeElement}
                          >
                            <b style={{ color: "#ededed" }}>- / -</b>
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
                        </>
                      )}
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
                            {style_type == "textShadow" ||
                            style_type == "boxShadow"
                              ? "A"
                              : op}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="position-sticky my-1 d-flex gap-2">
                    <div className="d-flex gap-2 border-0">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setTextWriteOpen(!textWriteOpen);
                        }}
                        className="toolbar-button props-btn"
                        style={{
                          wordSpacing: "pre-wrap",
                          minWidth: "max-content",
                        }}
                      >
                        &nbsp; {!textWriteOpen ? "open" : "close "} &nbsp;
                      </div>
                    </div>

                    <div className="" style={{ minWidth: "max-content" }}>
                      <>
                        <div
                          className="d-flex flex-row-reverse props-parent flex-wrap gap-2 overflow-x-auto"
                          style={{
                            height: "max-content",
                          }}
                        >
                          <button className="btn flex-grow-1 overflow-hidden btn-success props-btn rounded-0 p-0">
                            <label className="btn btn-success props-btn gap-2 rounded-0 w-100">
                              Add{" "}
                              <FontAwesomeIcon
                                icon={faImage}
                                color={text_clrH}
                              />
                              <input
                                type="file"
                                className="d-none"
                                accept="image/*"
                                onChange={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  addImageBox(e.target.files[0]);
                                }}
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
                        </div>
                      </>
                    </div>

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
                            <span className="mb-1 fw-semibold">
                              Round the border
                            </span>
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
                              handleChange(
                                activeElement?.id,
                                "borderRadius",
                                0
                              );
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

                  {textWriteOpen && (
                    <div className="mt-">
                      <textarea
                        className="form-control w-100 overflow-auto none-scroller border py-2"
                        value={activeElement?.content}
                        style={{
                          color: text_clrH,
                          border: `1px solid ${text_clrH}`,
                          minHeight: "80px",
                          fontSize: "10px",
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
                </div>
              </div>

              <div
                className="position-relative"
                style={{
                  marginTop: `calc(${textWriteOpen ? `134px` : "54px"} + ${
                    styleOpen ? `82px` : "44px"
                  })`,
                  width: "100%",
                  border: "2px solid red",
                  background: bg2,
                }}
              >
                <div
                  ref={canvasRef}
                  className="canvas-container w-100 position-relative"
                  style={{
                    height: `${canvasHeight}px`,
                    background: canvasBgColor,
                    overflow: "hidden",
                    maxWidth: "601px",
                    margin: "auto",
                  }}
                >
                  {elements.map((el, idx) => (
                    <Rnd
                      key={`${el.id}-${idx}`}
                      style={{
                        zIndex: el.zIndex,
                        border:
                          activeId === el.id
                            ? "2px dashed #ff0101ff"
                            : "2px solid transparent",

                        cursor: activeId ? "move" : "",
                      }}
                      spellCheck={false}
                      default={{
                        x: 0,
                        y: 0,
                        width: 320,
                        height: 200,
                      }}
                      disableDragging={!(activeId === activeElement?.id)}
                      enableResizing={activeId === activeElement?.id}
                      // onDragStop={(e) => {
                      //   if (activeElement.type === "image") {
                      //     console.log("dragg 1", e.clientX);
                      //     setActiveId(null);
                      //     setActiveElement({ id: "x" });
                      //   }
                      // }}
                      onTouchStart={(e) => {
                        setActiveId(el.id);
                        setActiveElement(el);
                      }}
                      onMouseDown={(e) => {
                        setActiveId(el.id);
                        setActiveElement(el);
                        console.log("dragg 2", Date.now());
                      }}
                    >
                      <div className="w-100 h-100 position-relative">
                        {activeId === el.id && (
                          <>
                            <button
                              className="btn text-light bg-danger btn-sm p-0 d-flex align-items-center justify-content-center position-absolute top-0 end-0 rounded-1"
                              style={{
                                zIndex: 1000,
                                width: "18px",
                                height: "18px",
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault(); // ⬅️ important
                                setActiveId(null);
                                setActiveElement({ id: "x" });
                                console.log("dragg 1", Date.now());
                              }}
                              onTouchStart={(e) => {
                                setTimeout(() => {
                                  e.stopPropagation();
                                  e.preventDefault(); // ⬅️ important
                                  setActiveId(null);
                                  setActiveElement({ id: "x" });
                                }, 100);
                              }}
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </button>

                            <div
                              className="position-absolute text-danger"
                              style={{
                                width: "24px",
                                height: "24px",
                                cursor: "nwse-resize",
                                rotate: "45deg",
                                bottom: "-12px",
                                right: "-12px",
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation();
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <FaArrowsAltH
                                className="position-absolute"
                                style={{
                                  top: "2px",
                                  left: "2px",
                                }}
                                size={20}
                              />
                            </div>
                          </>
                        )}

                        {el.type === "text" ? (
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
                              width: `${el.width}px`,
                              height: `${el.height}px`,
                              borderRadius: `${el.borderRadius}px`,
                            }}
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
                            // contentEditable={true}
                            // suppressContentEditableWarning={true}
                          >
                            {el.content}
                          </div>
                        ) : (
                          <div className="overflow-hidden  h-100 w-100">
                            <img
                              src={el.src}
                              alt="uploaded"
                              className="image-element overflow-hidden h-100 w-100"
                              draggable={false}
                              style={{
                                boxShadow: el.boxShadow,
                                position: "relative",
                                objectFit: "cover",
                                objectPosition: `${el.range1}px ${el.range2}px`,
                                borderRadius: `${el.borderRadius}px`,
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

                <div
                  onTouchStart={startResizing}
                  onMouseDown={startResizing}
                  className="position-absolute"
                  style={{
                    cursor: "pointer",
                    minWidth: "max-content",
                    bottom: "-14px",
                    right: "10px",
                    zIndex: 9834982093,
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
          </div>
        </div>

        <div style={{ background: bg2 }}>
          <div className="d-flex gap-3 p-2 ">
            <button
              className={`btn border p-1 ps-2 pe-2 rounded-5 `}
              onClick={() => setActiveBtn3Profile("Public")}
              style={{
                color: activeBtn3Profile === "Public" ? bg1 : text_clrH,
                background: activeBtn3Profile === "Public" ? text_clrH : "",
              }}
            >
              <small> For Public</small>
            </button>
            <button
              className={`btn border p-1 ps-2 pe-2 rounded-5 ${
                activeBtn3Profile === "Follower" ? "btn-dark" : ""
              }`}
              onClick={() => setActiveBtn3Profile("Follower")}
              style={{
                color: activeBtn3Profile === "Follower" ? bg1 : text_clrH,
                background: activeBtn3Profile === "Follower" ? text_clrH : "",
              }}
            >
              <small> For Follower</small>
            </button>
            <button
              className={`btn border p-1 ps-3 pe-3 rounded-5 ${
                activeBtn3Profile === "Paid" ? "btn-dark" : ""
              }`}
              onClick={() => setActiveBtn3Profile("Paid")}
              disabled={true}
              style={{
                color: activeBtn3Profile === "Paid" ? text_clrH : "",
                background: activeBtn3Profile === "Paid" ? text_clrH : "",
              }}
            >
              <small>Paid Only</small>
            </button>
          </div>

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
                <small style={{ color: text_clrM }}>
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
                className={`form-control rounded h-100 shadow-none ps-1 pe-2 overflow-auto none-scroller`}
                placeholder="Write about post here . . ."
                style={{
                  background: bg2,
                  color: text_clrH,
                  minHeight: `${text.split("\n").length * 22}px`,
                  border: `${
                    error ? "1px solid red" : `1px solid ${text_clrL}`
                  }`,
                }}
                spellCheck="false"
              />
            </div>
          </div>

          <div className="vibeTabs px-2">
            <Tabs
              id="controlled-tab-example"
              activeKey={category}
              onSelect={(k) => setCategory(k)}
              className="border-0 d-flex gap-3 py-2 flex-nowrap none-scroller overflow-auto"
              transition={false}
              style={{
                "--bg1": bg2,
                "--bg2": bg1,
                "--tc1": text_clrH,
                "--tc2": text_clrM,
                width: "100%",
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
      </div>
    )
  );
};

export default CanvasVibeEditor;
