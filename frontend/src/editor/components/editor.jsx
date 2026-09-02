import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { ImParagraphCenter } from "react-icons/im";
import { editorOn } from "../constant/constant";
import StyleSelector from "./styleSelector";
import { Loading } from "../../../TinyComponent/LazyLoading";
import { getPostObject } from "../constant/post";
import { useQuote } from "../../context/QueotrContext";

const values = [0, 1, 2, 3, 4, 5, 7, 10, 12, 14, 16, 18, 20];
const sides = ["marginLeft", "marginTop", "marginRight"];

const EditorZ = () => {
  const [bgColor, setBgColor] = useState("#191b1f");
  const editorRef = useRef();

  const { admin_user, API, token } = useQuote();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const post_obj = await getPostObject();

      if (post_obj.ready_url) {
        await axios.post(
          `${API}/api/sentence/post`,
          { ...post_obj, id: admin_user?._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Uploaded Successfully");
      } else alert("There is something wrong");
    } catch (err) {
      alert("Failed to post, Having connection or internal issue.");
      console.error("Error : ", err);
    }
  };

  useEffect(() => {
    if (editorRef.current) editorOn(editorRef.current);
  }, []);

  return (
    <StyleWrapper>
      <label htmlFor="myInput" className="w-100 mt-5 p-2">
        <StyleSelector />

        <div className="row-style text-light  px-1 d-flex gap-2">
          <div className="pad-l d-flex bg-dark gap-2 rounded-2 p-2 r-select">
            <small className="px-1">Margin</small>

            {sides.map((side) => (
              <select key={side} className="bg-none" data-value={side}>
                {values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <button className="btn txt-center bg-dark">
            <ImParagraphCenter />
          </button>

          <button
            className={`btn m-border bg-dark m-0 p-1 px-2 `}
            onClick={() => {
              const rows = document.querySelectorAll(".row-x");
              const hasAny = [...rows].some((el) =>
                el.classList.contains("show-row")
              );

              rows.forEach((el) =>
                el.classList[hasAny ? "remove" : "add"]("show-row")
              );
            }}
          >
            row
          </button>
        </div>

        <div className="m-border  text-light p-2 m-1 rounded bg-dark d-flex gap-2 align-items-center">
          <input
            type="color"
            name="bg-color"
            className="border-0 p-0 rounded"
            style={{ outline: "none", alignSelf: "flex-end" }}
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
          <input type="text" id="myInput" />
          <div className="r-c text-light "></div>
        </div>

        <div className="d-flex flex-column  gap-2 parent px-1">
          <div
            ref={editorRef}
            className="editor d-flex m-border  flex-column w-100"
            style={{
              backgroundColor: bgColor,
              padding: `${1}rem`,
            }}
          />
        </div>
      </label>

      <button
        type={true ? "button" : "submit"}
        className="btn btn-danger flex-grow-1 mx-3 px-4 rounded-0"
        style={{ height: "42px" }}
        onClick={handleSubmit}
      >
        {false ? <Loading clr={"white"} /> : "Post"}
      </button>
    </StyleWrapper>
  );
};

const StyleWrapper = styled.div`
  .parent {
    z-index: 1001;
    overflow: hidden;
    max-width: 400px;
    margin: 0 auto;
  }
  .editor {
    // border: 1px solid #636060;
    outline: none;
    white-space: unset;
    white-space-collapse: preserve;
    height: 56vh;
    cursor: text;
    position: relative;
    z-index: 90;
    overflow: hidden;
    userselect: "text";
  }

  #myInput {
    width: 40px;
    border: none;
    outline: none;
    caret-color: transparent;
    color: transparent;
    position: absolute;
    z-index: -100;
  }

  .h-center {
    align-items: center;
  }

  .v-center {
    justify-content: center;
  }

  .row-x {
    min-height: 24px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    border: 1px solid transparent;
  }

  .show-row {
    border: 1px solid #706f6f68;
    background-color: #f6f3f305;
  }

  .caret {
    animation: blink 1.2s steps(1) infinite;
    border: 1px solid red;
    position: absolute;
    display: inline;
    place-self: center;
    height: 100%;
    bottom: 0px;
    width: 0px;
    background: transparent;
    outline: none;
    color: transparent;
    padding: 0;
    z-index: 2003;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    50.01%,
    100% {
      opacity: 0;
    }
  }
  .ch {
    // border: 1px solid #333;
    display: inline-block;
    position: relative;
  }
`;

export default EditorZ;
