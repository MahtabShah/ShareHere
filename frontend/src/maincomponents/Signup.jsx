import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
import { Loading } from "../../TinyComponent/LazyLoading";

const Signup = ({}) => {
  const navigate = useNavigate();
  const [signupLoading, setsignupLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsignupLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/signup`, formData);
      // console.log("Signup successful! Token: " + res.data.token);
      localStorage.setItem("token", res.data.token);
      // fetchAllUsers();
      navigate("/home");
      window.location.reload();
    } catch (err) {
      alert("Signup failed: " + err.response?.data?.message || err.message);
    }
    setsignupLoading(false);
  };

  return (
    <section className="text-center">
      <div
        className="p-5 bg-image"
        style={{
          backgroundImage:
            "url('https://mdbootstrap.com/img/new/textures/full/171.jpg')",
          height: "300px",
        }}
      ></div>

      <div
        className="card mx-4 mx-md-5 shadow-5-strong bg-body-tertiary"
        style={{
          marginTop: "-150px",
          backdropFilter: "blur(30px)",
        }}
      >
        <div className="card-body py-5 px-md-5">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-5">Sign up now</h2>
              <form onSubmit={handleSubmit} className="">
                <div className="form-outline mb-4 d-flex flex-column">
                  <label className="form-label text-start" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    name="username"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-outline mb-4 d-flex flex-column">
                  <label className="form-label text-start" htmlFor="email">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    name="email"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-outline mb-4 d-flex flex-column">
                  <label className="form-label text-start" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    className="form-control"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex gap-3 justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-outline-primary btn-block mb-5 rounded-0 ps-3 pe-3"
                  >
                    {signupLoading ? (
                      <Loading dm={24} clr="light" />
                    ) : (
                      "Sign up"
                    )}
                  </button>

                  {/* <button
                    type="submit"
                    className="btn btn-success btn-block mb-5 rounded-0 ps-3 pe-3"
                  >
                    Login
                  </button> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
