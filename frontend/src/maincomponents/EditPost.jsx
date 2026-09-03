import { useParams } from "react-router-dom";
import { usePost } from "../context/PostContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuote } from "../context/QueotrContext";
import { useTheme } from "../context/Theme";
import { EachPost } from "./EachPost";
import { categories, objectPosition } from "../StanderdThings/StanderdData";
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

  const { textPrimary, textSecondary, textMuted, bgSurface, bgPage, borderColor } =
    useTheme();
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
          },
        );
        alert("Uploaded Successfully");
        nevigate("/home");
      }
    } catch (err) {
      alert(
        "Failed to post, Connection Error or internal issue: " +
          (err.response?.data?.message || err.message),
      );
      console.error("Error saving sentence", err);
    }
    setLazyLoading(false);
  };

  return (
    <>
      <div
        style={{ background: bgPage }}
        className="d-flex flex-column gap-2 p-3 my-5">
        <div
          className="d-flex rounded flex-row-reverse flex-wrap flex-md-nowrap gap-3 overflow-hidden"
          style={{}}>
          <div
            className="rounded align-items-center  pe-2 d-flex"
            style={{
              minHeight: "240px",
              margin: "auto",
            }}>
            <img
              src={post?.images[0]}
              alt=""
              className="rounded p-0"
              style={{
                objectFit: "cotain",
                objectPosition: "0, 0",
                maxHeight: "220px",
              }}
            />
          </div>

          <div
            className="d-flex flex-column w-100 gap-2 overflow-auto"
            style={{
              minHeight: "200px",
            }}>
            <textarea
              value={text}
              onChange={handleInput}
              className={`form-control position-relative d h-100 shadow-none p-2 overflow-auto none-scroller rounded `}
              placeholder="Write about post here . . ."
              style={{
                background: bgPage,
                color: textPrimary,
                border: `1px solid ${borderColor}`,
              }}
              spellCheck="false"
            />
          </div>
        </div>

        <div className="mt-2" style={{ color: textSecondary }}>
          <b>Set visibility : </b> Who can see your post ?
        </div>

        <div className="d-flex gap-3 mt-2">
          <button
            className={`btn border p-1 ps-2 pe-2 rounded-5 `}
            onClick={() => setVisiblity("Public")}
            style={{
              color: visiblity === "Public" ? bgSurface : textPrimary,
              background: visiblity === "Public" ? textPrimary : "",
            }}>
            <small> For Public</small>
          </button>
          <button
            className={`btn border p-1 ps-2 pe-2 rounded-5 ${
              visiblity === "Follower" ? "btn-dark" : ""
            }`}
            onClick={() => setVisiblity("Follower")}
            style={{
              color: visiblity === "Follower" ? bgSurface : textPrimary,
              background: visiblity === "Follower" ? textPrimary : "",
            }}>
            <small> For Follower</small>
          </button>
          <button
            className={`btn border p-1 ps-3 pe-3 rounded-5 ${
              visiblity === "Paid" ? "btn-dark" : ""
            }`}
            onClick={() => setVisiblity("Paid")}
            disabled={true}
            style={{
              color: visiblity === "Paid" ? bgSurface : textPrimary,
              background: visiblity === "Paid" ? textPrimary : "",
            }}>
            <small>Paid Only</small>
          </button>
        </div>

        <div
          className="vibeTabs mt-3 d-flex flex-column gap-2"
          style={{ color: textSecondary }}>
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
              "--bg1": bgSurface,
              "--bg2": bgPage,
              "--tc1": textPrimary,
              "--tc2": textSecondary,
              width: "100%",
            }}>
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
              color: textSecondary,
            }}
            onClick={() => {
              setCategory(post?.category);
              setVisiblity(post?.mode);
              setText(post?.text);
            }}>
            Reset
          </label>

          <button
            type={LazyLoading ? "button" : "submit"}
            className="btn btn-danger flex-grow-1 rounded-0"
            style={{ height: "42px" }}
            disabled={LazyLoading}
            onClick={handleSubmit}>
            {LazyLoading ? <Loading clr={"white"} /> : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditPost;
