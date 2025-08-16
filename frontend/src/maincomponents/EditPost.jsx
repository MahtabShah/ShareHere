import { useParams } from "react-router-dom";
import { usePost } from "../context/PostContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuote } from "../context/QueotrContext";
import { useTheme } from "../context/Theme";
import { EachPost } from "./EachPost";
import { categories } from "../StanderdThings/StanderdData";
import Tabs from "react-bootstrap/esm/Tabs";
import { Tab } from "bootstrap";
import { Loading } from "../../TinyComponent/LazyLoading";
import axios from "axios";

const EditPost = () => {
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const nevigate = useNavigate();
  const { admin_user, API, token } = useQuote();
  const { fetch_post_by_Id, fetch_user_by_Id } = usePost();
  const { id } = useParams();

  const CommentFn = async (id) => {
    setLoading(true);
    const Fetchpost = await fetch_post_by_Id(id);
    const FetchUser = await fetch_user_by_Id(Fetchpost?.userId);

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    setPost(Fetchpost);
    setUser(FetchUser);
  };

  useEffect(() => {
    CommentFn(id);
  }, []);

  const { text_clrH, text_clrL, text_clrM, bg1, bg2, mainbg, bg3 } = useTheme();
  const [category, setCategory] = useState(post?.category);
  const [visiblity, setVisiblity] = useState(post?.mode);
  const [text, setText] = useState(post?.text || "\n");
  const [error, setError] = useState("");
  const [LazyLoading, setLazyLoading] = useState(false);

  const handleInput = (e) => {
    setText(e.target.value);
  };

  useEffect(() => {
    setCategory(post?.category);
    setVisiblity(post?.mode);
    setText(post?.text);
  }, [post]);

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
      const ready_url = post?.images[0];

      console.log("ready url ", visiblity, text, category);

      if (ready_url) {
        const res = await axios.post(
          `${API}/api/sentence/post/edit`,
          {
            ready_url: ready_url,
            text: text,
            mode: visiblity,
            id: admin_user?._id,
            postId: id,
            category: category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Uploaded Successfully");
        nevigate("/home");
      }
    } catch (err) {
      alert(
        "Failed to post, Connection Error or internal issue: " +
          (err.response?.data?.message || err.message)
      );
      console.error("Error saving sentence", err);
    }
    setLazyLoading(false);
  };

  return (
    <>
      <div style={{ background: bg2 }} className="d-flex flex-column gap-2 p-3">
        <div className="d-flex  flex-row-reverse flex-wrap flex-md-nowrap gap-3">
          <div
            className="rounded p-2 w-sm-100 d-flex align-items-start"
            style={{
              minHeight: "240px",
              border: `1px solid ${text_clrL}`,
              background: bg2,
              margin: "auto",
            }}
          >
            <img
              src={post?.images[0]}
              alt=""
              className="rounded"
              style={{
                objectFit: "cover",
                maxHeight: "220px",
                margin: "auto",
              }}
            />
          </div>

          <div
            className="d-flex flex-column w-100 "
            style={{ maxHeight: "100%" }}
          >
            <div className="w-100">
              <div
                className="d-flex flex-column gap-2 overflow-auto"
                style={{ height: "240px" }}
              >
                <textarea
                  value={text}
                  onChange={handleInput}
                  className={`form-control position-relative rounded h-100 shadow-none p-2 overflow-auto none-scroller`}
                  placeholder="Write about post here . . ."
                  style={{
                    background: bg2,
                    color: text_clrH,
                    minHeight: "100%",
                    // minHeight: `${text?.split("\n").length * 25}px`,
                    border: `${
                      error ? "1px solid red" : `1px solid ${text_clrL}`
                    }`,
                  }}
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <b>Set visibility : </b> Who can see your post ?
        </div>

        <div className="d-flex gap-3 mt-2">
          <button
            className={`btn border p-1 ps-2 pe-2 rounded-5 `}
            onClick={() => setVisiblity("Public")}
            style={{
              color: visiblity === "Public" ? bg1 : text_clrH,
              background: visiblity === "Public" ? text_clrH : "",
            }}
          >
            <small> For Public</small>
          </button>
          <button
            className={`btn border p-1 ps-2 pe-2 rounded-5 ${
              visiblity === "Follower" ? "btn-dark" : ""
            }`}
            onClick={() => setVisiblity("Follower")}
            style={{
              color: visiblity === "Follower" ? bg1 : text_clrH,
              background: visiblity === "Follower" ? text_clrH : "",
            }}
          >
            <small> For Follower</small>
          </button>
          <button
            className={`btn border p-1 ps-3 pe-3 rounded-5 ${
              visiblity === "Paid" ? "btn-dark" : ""
            }`}
            onClick={() => setVisiblity("Paid")}
            disabled={true}
            style={{
              color: visiblity === "Paid" ? text_clrH : "",
              background: visiblity === "Paid" ? text_clrH : "",
            }}
          >
            <small>Paid Only</small>
          </button>
        </div>

        <div className="vibeTabs mt-3 d-flex flex-column gap-2">
          <div>
            <b>Select Category of the Post</b>
          </div>
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
              width: "100%",
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

        <div className="d-flex gap-3 justify-content-end mt-0">
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
            Reset
          </label>

          <button
            type={LazyLoading ? "button" : "submit"}
            className="btn btn-danger flex-grow-1 rounded-0"
            style={{ height: "42px" }}
            disabled={LazyLoading}
            onClick={handleSubmit}
          >
            {LazyLoading ? <Loading clr={"white"} /> : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditPost;
