import { useState, useEffect, Fragment } from "react";
import styled from "styled-components";

import { MdOutlineFileDownloadDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";

const color = {
  prop: "color",
  vis: "A",
  values: [
    // Neutrals
    "#00000000",
    "#000000",
    "#555555",
    "#777777",
    "#9a9a9a",
    "#afafaa",
    "#cfcfcf",
    "#e5e5e5",
    "#ffffff",

    // Reds & Pinks
    "#ff0000",
    "#e53935",
    "#d32f2f",
    "#b71c1c",
    "#ff5252",
    "#ff1744",
    "#f06292",
    "#ec407a",

    // Oranges & Yellows
    "#ff6f00",
    "#ff8f00",
    "#ffa000",
    "#ffb300",
    "#ffd54f",
    "#ffeb3b",
    "#fff176",

    // Greens
    "#2e7d32",
    "#388e3c",
    "#43a047",
    "#66bb6a",
    "#00c853",
    "#22cc88",
    "#a5d6a7",

    // Blues
    "#0d47a1",
    "#1565c0",
    "#1976d2",
    "#1e88e5",
    "#2196f3",
    "#42a5f5",
    "#00aaff",
    "#81d4fa",

    // Purples
    "#4a148c",
    "#6a1b9a",
    "#8e24aa",
    "#ab47bc",
    "#ce93d8",

    // Browns
    "#3e2723",
    "#5d4037",
    "#795548",
    "#a1887f",
  ],
  active: "#e5e5e5",
};

const fontSize = {
  prop: "fontSize",
  values: ["12px", "14px", "16px", "18px", "20px", "24px"],
  active: "18px",
};

const fontFamily = {
  prop: "fontFamily",
  values: [
    "Arial",
    "sans-serif",
    "Helvetica",
    "Segoe UI",
    "Roboto",
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Courier New",
    "monospace",
    "Consolas",
    "JetBrains Mono",
    "Poppins",
    "Montserrat",
  ],
  active: "Segoe UI, system-ui, sans-serif",
};

const invertHex = (hex = "#afdafd") => {
  let h = hex?.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");

  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  if (luminance < 60) return "#ffffff";
  if (luminance > 200) return "#00ff00";

  if (r > g && r > b) return "#00ff00";
  if (g > r && g > b) return "#ffffff";
  if (b > r && b > g) return "#00ff00";

  return luminance > 128 ? "#00ff00" : "#ffffff";
};

const StyleSelector = () => {
  const [activeStyles, setActiveStyles] = useState({
    color: "#e5e5e5",
    backgroundColor: "#00000000",
  });

  const handleClick = (prop, val) => {
    if (activeStyles[prop] == val) {
      val = "";
    }
    setActiveStyles((prev) => ({
      ...prev,
      [prop]: val,
    }));
  };

  const [hidden, setHidden] = useState(false);
  const [clr, setClr] = useState("color");
  const [window, setWindow] = useState(false);

  return (
    <StyleWrapper>
      <div className="d-flex flex-column gap-3 p-1 stylez">
        <div className="d-flex gap-2 overflow-auto p-2 rounded bg-dark m-border">
          {/* <div
            onClick={() => {
              setWindow((h) => !h);
            }}
            className={`rounded hv-center m-border active bg-dark`}
            style={{
              minWidth: "34px",
              aspectRatio: "1/1",
              cursor: "pointer",
            }}
          >
            <HiMiniBars3CenterLeft color="#efdfed" />
          </div> */}

          <div
            onClick={() => {
              setHidden((h) => !h);
              setClr("backgroundColor");
            }}
            data-prop={"backgroundColor"}
            data-value={activeStyles["backgroundColor"]}
            className={`rounded hv-center m-border active`}
            style={{
              background: activeStyles["backgroundColor"],
              minWidth: "34px",
              aspectRatio: "1/1",
              cursor: "pointer",
              color: invertHex(activeStyles["backgroundColor"]),
            }}
          >
            A
          </div>

          <div
            onClick={() => {
              setHidden((h) => !h);
              setClr("color");
            }}
            data-prop={"color"}
            data-value={activeStyles[color.prop]}
            className={`rounded hv-center m-border active`}
            style={{
              background: "#0000",
              minWidth: "34px",
              aspectRatio: "1/1",
              cursor: "pointer",
            }}
          >
            <span style={{ color: activeStyles[color.prop] }}>A</span>
          </div>

          <div
            className={`rounded hv-center m-border ${
              activeStyles["fontStyle"] === "italic" ? "active" : ""
            }`}
            data-prop={"fontStyle"}
            data-value={activeStyles["fontStyle"]}
            onClick={() => handleClick("fontStyle", "italic")}
            style={{
              fontStyle: "italic",
              fontFamily: "cursive",
              minWidth: "34px",
              aspectRatio: "1/1",
              cursor: "pointer",
              color: "#edffde",
            }}
          >
            I
          </div>

          <div
            className={`rounded hv-center m-border ${
              activeStyles["fontWeight"] === "bolder" ? "active" : ""
            }`}
            data-prop={"fontWeight"}
            data-value={activeStyles["fontWeight"]}
            onClick={() => handleClick("fontWeight", "bolder")}
            style={{
              fontWeight: "bolder",
              fontFamily: "cursive",
              minWidth: "34px",
              aspectRatio: "1/1",
              cursor: "pointer",
              color: "#edffde",
            }}
          >
            B
          </div>

          <select
            className="m-border p-1 small bg-dark rounded gap-2"
            defaultValue={"18px"}
          >
            {fontSize.values.map((val) => {
              return (
                <option
                  key={val}
                  value={val}
                  className={`text-light px-3 m-border rounded`}
                  data-value={val}
                  data-prop={"fontSize"}
                >
                  {val}
                </option>
              );
            })}
          </select>

          <select
            className="small m-border p-1 ps-2 bg-dark rounded gap-2"
            style={{ width: "84px" }}
          >
            {fontFamily.values.map((val) => {
              return (
                <option
                  key={val}
                  value={val}
                  className={`text-light px-3 m-border rounded`}
                  data-value={val}
                  data-prop={"fontFamily"}
                  style={{ fontFamily: val }}
                >
                  {val}
                </option>
              );
            })}
          </select>
        </div>

        {hidden && (
          <div className="color d-flex flex-wrap position-absolute bg-dark justify-content-evenly rounded gap-2 m-border overflow-auto">
            <div className="color d-flex flex-wrap bg-dark justify-content-evenly rounded gap-2 overflow-auto p-2">
              {color.values.map((e, i) => {
                const isActive = activeStyles[clr] === e;

                return (
                  <Fragment key={e + i + "clr"}>
                    {i == 0 && (
                      <div
                        key={"cancel"}
                        className="text-danger top-0 position-sticky bg-dark fs-5 rounded m-border hv-center clr "
                        onClick={() => setHidden(false)}
                        style={{ cursor: "pointer" }}
                      >
                        <RxCross2 />
                      </div>
                    )}
                    <div
                      className={`rounded m-border hv-center clr ${
                        isActive ? "active" : ""
                      }`}
                      style={{ background: e, cursor: "pointer" }}
                      onClick={() => {
                        setActiveStyles((prev) => ({
                          ...prev,
                          [clr]: e,
                        }));
                      }}
                    >
                      {isActive && (
                        <MdOutlineFileDownloadDone
                          className="rounded-4"
                          size={20}
                          color={invertHex(e)}
                        />
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* {window && (
          <div
            className="m-border rounded gap-2 d-flex flex-column text-light position-absolute bg-dark p-3"
            style={{ top: "62px" }}
          >
            <div className="m-border p-2 px-3 rounded">Apply char style</div>
            <div className="m-border p-2 px-3 rounded">Apply row style</div>
          </div>
        )} */}
      </div>
    </StyleWrapper>
  );
};

const StyleWrapper = styled.div`
  .stylez button {
    background-color: #1a1a1a;
    color: aliceblue;
    padding: 6px 14px;
    border: 1px solid #7e7d7d;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: max-content;
  }

  .active {
    background-color: aliceblue;
    color: #1a1a1a !important;
    border: 1px solid #2bd737;
  }

  .color {
    width: 220px;
    height: 208px;
    z-index: 1100;
    // top: 64px;
  }

  .clr {
    height: 32px !important;
    min-width: 32px !important;
  }

  .color::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export default StyleSelector;
