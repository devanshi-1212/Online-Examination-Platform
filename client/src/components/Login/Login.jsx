import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import "./Login.css";

const Login = () => {
  const [info, setInfo] = useState({
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

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = info;

    if (!email || !password) {
      return handleError("All fields are required.");
    }

    try {
      const url = "http://localhost:5000/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/dashboard");
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
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div className="item">
          <input
            onChange={handleChange}
            type="email"
            name="email"
            autoFocus
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
          Don't have an account? <Link to="/signup">Signup</Link>
        </div>

        <button type="submit" className="submitbtn">
          Login
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Login;
