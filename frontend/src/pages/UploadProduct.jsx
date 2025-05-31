import React, { useRef, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Accordion } from "react-bootstrap";

import { Button, Card, CloseButton, Form, Row, Col } from "react-bootstrap";
import { FaImage } from "react-icons/fa";

const UploadProduct = ({ fetchUser, user, setUser }) => {
  const [formData, setFormData] = useState({
    product_name: "",
    product_subtitle: "",
    product_discription: "",
    discount: "",
    price: "",
    id: uuidv4(),
    keyHighLight: [],
    product_details: "",
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert("You can't upload more than 10 images.");
      return;
    }

    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImageUrls]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.product_name.trim())
      newErrors.product_name = "Name is required";
    if (!formData.product_subtitle.trim())
      newErrors.product_subtitle = "Subtitle is required";
    if (!formData.price || isNaN(formData.price))
      newErrors.price = "Valid price is required";
    return newErrors;
  };

  const keyRef = useRef(null);
  const valRef = useRef(null);
  const pushRef = useRef(null);
  const [items, setItems] = useState([
    { key: "Color", val: "Black, Green, Blue, Red, White, Dark" },
  ]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [disableDelete, setdisableDelete] = useState(false);
  const [lgbreakPoint, setlgbreakPoint] = useState(window.innerWidth > 1224);

  const AddHighlightPoint = (e) => {
    const key = keyRef.current.value.trim();
    const val = valRef.current.value.trim();
    if (!key || !val) return;
    {
      editingIndex !== null
        ? setdisableDelete(!disableDelete)
        : setdisableDelete(false);
    }

    if (editingIndex !== null) {
      // Edit mode
      const updatedItems = [...items];
      updatedItems[editingIndex] = { key, val };
      setItems(updatedItems);
      setEditingIndex(null);
    } else {
      // Add mode
      setItems([...items, { key, val }]);
      keyRef.current.value = "";
      valRef.current.value = "";
    }
  };

  const handleDelete = (index) => {
    const filteredItems = items.filter((_, i) => i !== index);
    setItems(filteredItems);
  };

  const handleEdit = (index) => {
    const item = items[index];
    keyRef.current.value = item.key;
    valRef.current.value = item.val;
    setEditingIndex(index);
    setdisableDelete(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "keyHighLight") {
        form.append("keyHighLight", JSON.stringify(items)); // ✅ Serialize properly
      } else {
        form.append(key, formData[key]);
      }
    });
    // Append images
    for (let i = 0; i < images.length; i++) {
      form.append("images", images[i]);
    }

    try {
      form.append("user", JSON.stringify(user)); // Must be stringified

      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        body: form, // FormData object
      });

      if (res.ok) {
        const updatedUser = await res.json(); // Get the response
        alert("Uploaded successfully!");
        setUser(updatedUser);
        fetchUser(); // Refresh homepage data
        navigate("/");
      } else {
        alert("Upload failed!");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      // setIsDisplayedLeftNav(window.innerWidth < 768);
      setlgbreakPoint(window.innerWidth > 1224);
    });
  }, []);

  return (
    <>
      {/* <PostUploader /> */}
      <div
        className={`d-flex overflow-hidden gap-3 p- pt-0 ${
          lgbreakPoint ? "flex-row" : "flex-column"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          noValidate
          className="needs-validation overflow-hidden flex-grow-1"
          method="POST"
          action="/upload"
          enctype="multipart/form-data"
        >
          <div className="upload-section d-flex flex-column" id={formData.id}>
            <h4>Aaiye Post karte hai !! New Post</h4>
            <ul className="p-0 " style={{ listStyle: "none" }}>
              {/* <PostUploaderBootstrap /> */}

              <li>
                <div
                  className="border position-relative rounded-0 mb-3"
                  style={{ right: 0, minHeight: "230px" }}
                >
                  <div
                    className="border position-absolute bg-light rounded- pt-1 d-flex align-items-center"
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
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex gap-2 align-items-center  p-2 pb-0 pt-1">
                      <div
                        className="d-flex fw-semibold text-white rounded-5 align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#d63384",
                        }}
                      >
                        M
                      </div>
                      <div>
                        <div style={{ fontWeight: "bold" }}>Mahtāb Shah</div>
                        {/* <small style={{ color: "#888" }}>
                          Visibility: Public
                        </small> */}
                      </div>
                    </div>

                    <div className="small">
                      <label
                        htmlFor="images"
                        className="form-label h-100 text-dark px-2 cursor-pointer p-2 border"
                      >
                        Select Images
                      </label>
                    </div>
                  </div>
                  <div
                    className="border d-flex m-2 rounded-3"
                    style={{ overflowX: "auto" }}
                  >
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="border overflow-hidden rounded-3 m-3"
                        style={{
                          height: "200px",
                          width: "200px",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="h-100 w-100"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </li>

              {/* Form Fields */}
              {[
                {
                  label: "Name of Item",
                  name: "product_name",
                  type: "text",
                  required: true,
                },
                {
                  label: "Subtitle",
                  name: "product_subtitle",
                  type: "text",
                  required: true,
                },
                {
                  label: "Discription",
                  name: "product_discription",
                  type: "text",
                  required: false,
                },
                {
                  label: "Any Discount",
                  name: "discount",
                  type: "tel",
                  required: false,
                },
                {
                  label: "Price of Item",
                  name: "price",
                  type: "tel",
                  required: true,
                },
              ].map(({ label, name, type, required }) => (
                <li
                  key={name}
                  className={` d-flex bg-light align-items-center p-1 pt-2 ps-3 text-dark border-0 mt-3 rounded-0 position-relative ${
                    errors[name] ? "is-invalid" : ""
                  }`}
                >
                  <label
                    htmlFor={name}
                    className="form-label"
                    style={{ minWidth: "120px" }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    id={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    className={`form-control bg-light text-dark border-0 rounded-0 p-2  ${
                      errors[name] ? "is-invalid" : ""
                    }`}
                    style={{
                      borderLeft: "1px solid var(--lightBlack-clr) !important",
                    }}
                  />
                </li>
              ))}
            </ul>
            <Accordion
              className="border"
              data-bs-theme="light"
              flush
              alwaysOpen
            >
              <Accordion.Item eventKey="0" className="rounded-0">
                <Accordion.Header className="">More</Accordion.Header>
                <Accordion.Body className="bg-dark text-white ">
                  <div>
                    <h6
                      className="ms-0 mb-3 fw-medium"
                      style={{ color: "#1a4" }}
                    >
                      Key Highlight
                    </h6>

                    <div>
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="d-flex border-top gap-2 mb-3 w-100 position-relative align-items-center"
                        >
                          <span
                            className="flex-grow-1 p-2 ps-0"
                            style={{ width: "44%" }}
                          >
                            {item.key}
                          </span>
                          <span className="flex-grow-1 w-50 p-2">
                            {item.val}
                          </span>

                          <span
                            className="HighlighteditDot fs-6 fw-semibold"
                            onClick={() => handleEdit(index)}
                          >
                            ✎
                          </span>

                          <span
                            className={`HighlighteditDot fs-6 fw-semibold text-danger disabled ${
                              disableDelete ? " pe-none" : ""
                            }`}
                            onClick={() => handleDelete(index)}
                            aria-disabled="true"
                            tabIndex="-1"
                          >
                            🗑
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <input
                      type="text"
                      name="name"
                      id="Key"
                      className="p-2 flex-grow-1"
                      onChange={handleChange}
                      placeholder="Key"
                      ref={keyRef}
                    />
                    <input
                      type="text"
                      name="name"
                      id="Value"
                      placeholder="Value"
                      className="p-2 flex-grow-1"
                      onChange={handleChange}
                      ref={valRef}
                    />
                    <span
                      className="btn btn-outline-light ps-4 rounded-0 pe-4"
                      onClick={AddHighlightPoint}
                    >
                      {editingIndex !== null ? "Update" : "Add"}
                    </span>
                  </div>

                  <div>
                    <label htmlFor="productDetails">Product details</label>
                    <textarea
                      name="productDetails"
                      id="productDetails"
                      className="w-100 p-2"
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <button
              type="submit"
              className="btn btn-outline-danger rounded-0 mt-3"
              style={{ right: "0" }}
            >
              Submit
            </button>
          </div>
        </form>

        {/* <div
          className="d-flex flex-column flex-grow-1"
          style={{
            minWidth: "440px",
            maxWidth: `${lgbreakPoint ? "480px" : "100%"}`,
          }}
        >
          <h4>Gallery Style Post</h4>

          <div className={`d-flex flex-column gap-3`}>
            <div
              className={`Horizontal d-flex overflow-auto webkit-scroller  ${
                !images.length ? "gap-3" : ""
              }`}
              style={{
                height: "140px",
                border: "1px solid var(--lightBlack-clr)",
              }}
            >
              {!images.length && (
                <>
                  <span
                    className="flex-grow-1"
                    style={{ border: "1px solid var(--lightBlack-clr)" }}
                  ></span>
                  <span
                    className="flex-grow-1"
                    style={{ border: "1px solid var(--lightBlack-clr)" }}
                  ></span>
                  <span
                    className="flex-grow-1"
                    style={{ border: "1px solid var(--lightBlack-clr)" }}
                  ></span>
                </>
              )}
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="border overflow-hidden rounded-3 m-3"
                  style={{
                    // height: "200px",
                    width: "100px",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    className="h-100 w-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>

            <div
              className="Horizontal d-flex gap-3 p-3"
              style={{ border: "1px solid var(--lightBlack-clr)" }}
            >
              <span
                className="flex-grow-1"
                style={{
                  height: "240px",
                  border: "1px solid var(--lightBlack-clr)",
                }}
              ></span>
              <div
                className="d-flex gap-3 flex-grow-1 flex-column"
                style={{ height: "240px" }}
              >
                <span
                  className="flex-grow-1"
                  style={{ border: "1px solid var(--lightBlack-clr)" }}
                ></span>
                <span
                  className="flex-grow-1"
                  style={{ border: "1px solid var(--lightBlack-clr)" }}
                ></span>
              </div>
            </div>

            <div
              className="Horizontal d-grid gap-3 p-3"
              style={{ border: "1px solid var(--lightBlack-clr)" }}
            >
              <div className="d-flex gap-3" style={{ height: "120px" }}>
                <span
                  className="flex-grow-1"
                  style={{ border: "1px solid var(--lightBlack-clr)" }}
                ></span>
                <span
                  className="flex-grow-1"
                  style={{ border: "1px solid var(--lightBlack-clr)" }}
                ></span>
              </div>
              <div className="d-flex gap-3" style={{ height: "120px" }}>
                <span
                  className="flex-grow-1"
                  style={{ border: "1px solid var(--lightBlack-clr)" }}
                ></span>
                <span
                  className="flex-grow-1"
                  style={{ border: "1px solid var(--lightBlack-clr)" }}
                ></span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

// const PostUploaderBootstrap = () => {
//   return (
//     <Card
//       style={{ maxWidth: "600px", margin: "20px auto", borderRadius: "12px" }}
//     >
//       <Card.Body>
//         <div
//           style={{
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             padding: "40px 20px",
//             textAlign: "center",
//             position: "relative",
//           }}
//         >
//           <CloseButton
//             style={{ position: "absolute", top: "10px", right: "10px" }}
//           />
//           <div style={{ fontSize: "24px", color: "#0d6efd" }}>
//             <FaImage />
//           </div>
//           <p className="mt-2 mb-1">Drag up to 5 images or GIFs or</p>
//           <Form.Text className="text-primary" style={{ cursor: "pointer" }}>
//             select from your computer
//           </Form.Text>
//           <p className="text-muted mt-3" style={{ fontSize: "12px" }}>
//             Upload an image with an aspect ratio between 2:5 and 5:2
//             <br />
//             Only select images or GIFs that you have permission to use
//           </p>
//         </div>

//         <div className="d-flex justify-content-end mt-3 gap-2">
//           <Button variant="light">Cancel</Button>
//           <Button variant="secondary" disabled>
//             Post
//           </Button>
//         </div>
//       </Card.Body>
//     </Card>
//   );
// };

export default UploadProduct;
