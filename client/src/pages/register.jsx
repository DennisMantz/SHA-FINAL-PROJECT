import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator"; // Import the validator library

const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PROD;

function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({}); // State to store validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    // Password validation logic
    if (name === "password") {
      if (!validator.isStrongPassword(value, { minLength: 8 })) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password:
            "Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.",
        }));
      } else {
        setErrors((prevErrors) => {
          const { password, ...rest } = prevErrors; // Remove password error if valid
          return rest;
        });
      }
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      register();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };

  const register = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const { username, email, password, password2 } = newUser;

    // Validation checks
    if (!username || !email || !password || !password2) {
      alert("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    if (password !== password2) {
      alert("Passwords don't match.");
      setIsSubmitting(false);
      return;
    }

    if (errors.password) {
      alert(errors.password);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        const { msg, token } = response.data;
        alert(msg);
        if (token) {
          localStorage.setItem("token", token);
        }
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.msg === "A user with this email already exists") {
          alert("This email is already registered. Please use a different email.");
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
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
      <div className="col-span-2 bg-gray-200 flex items-center mt-0 sm:mt-[-100px] justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={newUser.username}
              placeholder="Enter your username"
              onChange={handleChange}
              onKeyDown={handleEnter}
              className="w-full px-3 py-2 border rounded border-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={newUser.email}
              placeholder="Enter your email"
              onChange={handleChange}
              onKeyDown={handleEnter}
              className="w-full px-3 py-2 border rounded border-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={newUser.password}
              placeholder="Enter your password"
              onChange={handleChange}
              onKeyDown={handleEnter}
              className="w-full px-3 py-2 border rounded border-gray-300"
              required
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password2" className="block text-gray-700 font-bold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="password2"
              id="password2"
              value={newUser.password2}
              placeholder="Confirm your password"
              onChange={handleChange}
              onKeyDown={handleEnter}
              className="w-full px-3 py-2 border rounded border-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 text-white font-bold rounded ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gray-800 hover:scale-105"
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
          <p className="mt-4 text-gray-600 text-center">
            Already have an account?{" "}
            <button
              className="text-gray-700 hover:text-gray-800 hover:scale-105"
              onClick={() => navigate("/login")}
            >
              Login
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
              <strong>Online Cards</strong> via <strong>ShareBRO</strong>, let you share socials, business details, or CV-like cards with one link.
            </p>
            <p className="mb-4">
              <strong>Coming Soon:</strong> Save exam papers digitally and set reminders for retakes.
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

export default Register;
