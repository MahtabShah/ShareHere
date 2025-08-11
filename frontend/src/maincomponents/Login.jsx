import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
import { Loading } from "../../TinyComponent/LazyLoading";
import { useQuote } from "../context/QueotrContext";

const Login = ({}) => {
  const navigate = useNavigate();
  const [signupLoading, setsignupLoading] = useState(false);
  const { fetch_admin_user } = useQuote();

  const [formData, setFormData] = useState({
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
      const res = await axios.post(`${API}/api/auth/login`, formData);
      // alert("Login successful! Token: " + res.data.token);
      localStorage.setItem("token", res.data.token);
      // fetchAllUsers();
      await fetch_admin_user();

      navigate("/home");
      window.location.reload();
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message || err.message);
    } finally {
      setsignupLoading(false);
    }
  };

  return (
    <>
      <section className="text-center">
        <div
          className="p-4 bg-image"
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
                <h2 className="fw-bold mb-3">Login now</h2>
                <form onSubmit={handleSubmit} className="">
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

                  <div className="form-outline mb-2 d-flex flex-column">
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

                  <div className="d-flex flex-column gap-2 align-items-center">
                    <hr />
                    <div className="d-flex gap-2 align-items-center">
                      <small>you dont have any account ?</small>

                      <a
                        className="btn text-primary fw-bold btn-block rounded-0 ps-3 pe-3"
                        href="/signup"
                      >
                        Sign up
                      </a>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-success btn-block mb-2 rounded-0 ps-3 pe-3"
                    >
                      {signupLoading ? (
                        <Loading dm={24} clr="light" />
                      ) : (
                        "Login"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
