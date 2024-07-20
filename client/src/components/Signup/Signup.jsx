import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import "./Signup.css";

const Signup = () => {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedInfo = { ...info };

    updatedInfo[name] = value;
    setInfo(updatedInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password } = info;

    if (!name || !email || !password) {
      return handleError("All fields are required.");
    }

    try {
      const url = "http://localhost:5000/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="body">
      <h1>Signup</h1>

      <form onSubmit={handleSignup}>
        <div className="item">
          <input
            onChange={handleChange}
            type="text"
            name="name"
            autoFocus
            placeholder="Name"
            value={info.name}
          />
        </div>

        <div className="item">
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email"
            value={info.email}
          />
        </div>

        <div className="item">
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Password"
            value={info.password}
          />
        </div>

        <div>
          Already have an account? <Link to="/login">Login</Link>
        </div>

        <button type="submit" className="submitbtn">
          Signup
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Signup;
