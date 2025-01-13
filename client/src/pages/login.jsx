import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator"; // Import validator library

const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PROD;
console.log("Using API URL:", API_URL);

function Login() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });

    if (name === "password") {
      if (!validator.isStrongPassword(value, { minLength: 8 })) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password:
            "Password must be at least 8 characters and include a mix of letters, numbers, and symbols.",
        }));
      } else {
        setErrors((prevErrors) => {
          const { password, ...rest } = prevErrors; // Remove password error if valid
          return rest;
        });
      }
    } else {
      setErrors({ ...errors, [name]: "" }); // Reset validation messages for other fields
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      pressLogin();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    pressLogin();
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = "Email is required.";
    if (!loginData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pressLogin = async () => {
    if (isSubmitting || !validateInputs()) return;

    setIsSubmitting(true);
    try {
      const { email, password } = loginData;

      const response = await axios.post(`${API_URL}/users/login`, loginData);
      if (response.status === 200) {
        const { token, msg } = response.data;
        localStorage.setItem("token", token);
        alert(msg); // Display success message
        navigate("/"); // Redirect to homepage
      }
    } catch (error) {
      if (error.response) {
        const { msg } = error.response.data;
        alert(msg || "An unexpected server error occurred.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 w-full min-h-screen">
      {/* Left Section */}
      <div className="col-span-2 bg-gray-200 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={loginData.email}
              placeholder="Enter your email"
              onChange={handleChange}
              onKeyDown={handleEnter}
              className={`w-full px-3 py-2 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
              autoComplete="username"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-1">
              Password
            </label>
            <input
              title="Password must be at least 8 characters long and include a mix of letters, numbers, and symbols."
              type="password"
              name="password"
              id="password"
              value={loginData.password}
              placeholder="Enter your password"
              onChange={handleChange}
              onKeyDown={handleEnter}
              className={`w-full px-3 py-2 border rounded ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              required
              autoComplete="current-password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className={`w-full py-2 text-white font-bold rounded ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gray-800 hover:scale-105"
            }`}
            disabled={isSubmitting}
            aria-live="polite"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          <p className="mt-4 text-gray-600 text-center">
            Don't have an account?{" "}
            <button
              className="text-gray-700 hover:text-gray-800 hover:scale-105"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>

      {/* Right Section */}
      <div className="bg-gray-200 flex justify-center items-center sm:bg-gray-800 text-white">
        <div className="w-full max-w-sm p-6 text-center bg-gray-800 rounded shadow">
          <img
            src="/assets/syncBro-WHITE-ALIGNED.png"
            alt="logo"
            className="w-full max-w-[300px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[300px] object-contain mx-auto"
          />

          <p className="text-lg italic mt-6">One app to rule them all!</p>
          <div className="mt-10 max-w-sm px-4">
            <p className="mb-4">
              <strong>Bookmark Groups</strong> to organize tasks and manage links efficiently.
            </p>
            <p className="mb-4">
              <strong>Online Cards</strong> via <strong>ShareBRO</strong>, let you share socials,
              business details, or CV-like cards with one link.
            </p>
            <p className="mb-4">
              <strong>Coming Soon:</strong> Save exam papers digitally and set reminders for
              retakes.
            </p>
            <p>
              <strong>Coming Soon:</strong> Organize and manage yearly chores effortlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
