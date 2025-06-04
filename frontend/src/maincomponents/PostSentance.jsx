import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loading } from "../../TinyComponent/LazyLoading";
import PreImages from "../../TinyComponent/PreImages";
import Carousel from "react-bootstrap/Carousel";
import Nav from "react-bootstrap/Nav";
import { QuoteProvider } from "../context/QueotrContext";
import { useQuote } from "../context/QueotrContext";
// import "@fortawesome/fontawesome-free/css/all.min.css";
import { MdFormatSize } from "react-icons/md";
import TextToImage from "../../TinyComponent/ConvertDivintoImg";
import html2canvas from "html2canvas";

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
  const [pre_style, setPre_style] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [curr_user, setcurr_user] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // console.log(style);

  const token = localStorage.getItem("token");

  const handleInput = (idx, e, key) => {
    if (key === "text") {
      setText(e.target.value);
    } else if (key === "image_text") {
      setimage_Text(e.target.value);
      const updated = [...vibes];
      updated[activeIndex] = e.target.value;

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
          pre_style: pre_style[idx],
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
      setPre_style([]);
      setStyle([]);
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

  const { style, setStyle } = useQuote();

  useEffect(() => {
    setTimeout(() => {
      if (pre_style[activeIndex]) {
        setStyle({ ...pre_style[activeIndex] }); // load saved style for that slide
      }
    }, 330);
  }, [activeIndex]);

  useEffect(() => {
    setPre_style((prev) => {
      const updated = [...prev];
      updated[activeIndex] = { ...style };
      return updated;
    });
  }, [style, activeIndex]);

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

  // console.log("pre style = = = > ", pre_style);

  const containerRef = useRef();
  const [fontSize, setFontSize] = useState(16); // default px

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;

        // Scale logic: font size = width / 20, clamp it
        const newFontSize = Math.min(Math.min(width / 30)); // min 12px, max 36px
        setFontSize(newFontSize);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
                multiple
                onChange={handleImageChange}
              />
            </div>

            <pre>
              <div
                className="d-flex  mt-0 border"
                style={{
                  width: "calc(100% - 0rem)",
                  maxWidth: "600px",
                  aspectRatio: "17/17",
                  background: `${bg_clr}`,
                  fontSize: fontSize,
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
                          aspectRatio: "17/17",
                          flexShrink: 0,
                          ...pre_style[idx],
                          ...style,
                          top: "0",
                          left: "0",
                          zIndex: 100, // higher
                          background: "#3330", // transparent background
                          caretColor: "red",
                          whiteSpace: "pre-wrap", // mimic pre
                          overflow: "hidden", // hide scroll
                          resize: "none", // prevent resizing
                        }}
                        ref={containerRef}
                      >
                        <div
                          className="w-100 h-100 bg-image p-3"
                          style={{
                            background:
                              page.type === "img"
                                ? `url(${page.val})`
                                : page.val,
                          }}
                        />
                        {/* <pre> */}
                        <textarea
                          name="image_text"
                          id="image_text"
                          className="position-absolute border w-100 h-100 p-2"
                          style={{
                            ...pre_style[idx],
                            ...style,
                            top: "0",
                            left: "0",
                            zIndex: 100, // higher
                            background: "#3330", // transparent background
                            caretColor: "red",
                            whiteSpace: "pre-wrap", // mimic pre
                            overflow: "hidden", // hide scroll
                            resize: "none", // prevent resizing
                          }}
                          value={vibes[idx] || ""}
                          onChange={(e) => handleInput(idx, e, "image_text")}
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
            </pre>

            <div
              className="d-flex gap-2 me-3 mt-2 ms-3 none-scroller overflow-x-auto overflow-y-hidden"
              style={{ maxHeight: "80px", maxWidth: "100%" }}
            >
              {pre_bg_color.map((c, idx) => {
                return (
                  <>
                    <span
                      key={`bg-${idx}`}
                      className="rounded-5 d-block"
                      style={{
                        minWidth: "34px",
                        minHeight: "34px",
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

            <div className="d-flex gap-1 align-items-center justify-content-center mt-1">
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

          <div className="border">
            <div className="d-flex gap-2 align-items-center  p-2 pb-0 pt-2">
              <div
                className="d-flex fw-semibold ms-1 border text-white rounded-5 align-items-center justify-content-center"
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
                required
                className={`form-control rounded-0 shadow-none ps-2 pe-2 border-0`}
                placeholder="Write about post here . . ."
                style={{ overflow: "hidden", resize: "none" }}
                spellCheck="false"
              />
            </div>
          </div>

          {Errors && <small className="text-danger">{Errors}</small>}
          <br />

          {/* {browsssss imggggg} */}
          <div className="d-flex gap-3 justify-content-end p-0 m-0">
            {/* {isPre_Image} */}
            {!true ? (
              <div
                className="btn btn-outline-primary ps-3 pe-3 rounded-0 p-2"
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
                className="btn btn-outline-primary ps-3 pe-3 rounded-0 p-2"
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
    "Lato",
    "Oswald",
    "Montserrat",
    "Raleway",
    "Ubuntu",
    "Merriweather",
    "PT Sans",
    "Source Sans Pro",
    "Noto Sans",
    "Fira Sans",
    "Inconsolata",
    "Droid Sans",
    "Cabin",
    "Exo",
    "Quicksand",
    "Rubik",
    "Work Sans",
    "Josefin Sans",
    "Bebas Neue",
    "Playfair Display",
    "Anton",
    "Cinzel",
    "Zilla Slab",
    "Arvo",
    "Mukta",
    "Hind",
    "Karla",
    "IBM Plex Sans",
    "Cairo",
    "Manrope",
    "Poppins",
  ];

  const fontSize = [
    "0.1em",
    "0.2em",
    "0.3em",
    "0.4em",
    "0.5em",
    "0.6em",
    "0.7em",
    "0.8em",
    "0.9em",
    "1.0em",
    "1.1em",
    "1.2em",
    "1.3em",
    "1.4em",
    "1.5em",
    "1.6em",
    "1.7em",
    "1.8em",
    "1.9em",
    "2.0em",
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
    // "solid",
    // "double",
    // "dotted",
    // "dashed",
    // "wavy",
    // "auto", // For text-decoration-thickness
    // "from-font", // For text-decoration-thickness
    // "thin",
    // "medium",
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

  const [active_style, setActive_style] = useState("fontSize");

  const { quote, style, setStyle } = useQuote();

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
      </div>

      {[
        { curr_style: "fontSize", replace: "px", Props: fontSize },
        { curr_style: "fontWeight", replace: "", Props: fontWeight },
        { curr_style: "fontFamily", replace: "", Props: fontFamily },
        { curr_style: "textAlign", replace: "", Props: textAlign },
        { curr_style: "letterSpacing", replace: "px", Props: letterSpacing },
        { curr_style: "color", replace: "", Props: pre_bg_color },
        { curr_style: "textShadow", replace: "", Props: textShadow },
        { curr_style: "fontStyle", replace: "", Props: fontStyle },
        { curr_style: "", replace: "", Props: fontStyle },
        {
          curr_style: "textDecoration",
          replace: "",
          Props: textDecoration,
        },
      ].map((el) => {
        return (
          active_style === el.curr_style && (
            <Driver
              Props={el.Props}
              handleStyleChange={handleStyleChange}
              val={active_style}
              to={el.to || ""}
              replace={el.replace}
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
