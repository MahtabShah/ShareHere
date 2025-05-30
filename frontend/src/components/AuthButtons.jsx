import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthButtons = ({ onLogout }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    if (onLogout) onLogout();
  };

  if (loggedIn) {
    return (
      <div className="d-flex gap-2">
        <button
          className="btn btn-secondary"
          onClick={() => alert("Go to profile")}
        >
          Profile
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex gap-2">
      <button
        className="btn btn-outline-primary"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
      <button className="btn btn-primary" onClick={() => navigate("/signup")}>
        Signup
      </button>
    </div>
  );
};

const Header = () => {
  return (
    <nav className="navbar navbar-light bg-light px-3">
      <a className="navbar-brand" href="/">
        YourApp
      </a>
      <AuthButtons />
    </nav>
  );
};

export default Header;
