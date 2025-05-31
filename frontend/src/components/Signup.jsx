import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

const Signup = () => {
  const navigate = useNavigate();
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
    try {
      const res = await axios.post(`${API}/api/auth/signup`, formData);
      // console.log("Signup successful! Token: " + res.data.token);
      localStorage.setItem("token", res.data.token);

      navigate("/home");
    } catch (err) {
      alert("Signup failed: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
