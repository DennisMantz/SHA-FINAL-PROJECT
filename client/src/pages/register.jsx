import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  function handleChange(e) {
    try {
      let { value, name } = e.target;
      setNewUser({ ...newUser, [name]: value });
      // console.log(`Updated ${name}: ${value}`);
    } catch (error) {
      console.log(`Error updating input: ${error}`);
    }
  }

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      register();
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    register();
  }


  const register = async () => {

    if (isSubmitting) return; // Prevent double-submit

    setIsSubmitting(true); // Disable button

    const { username, email, password, password2 } = newUser;
    //validation check
    if (!username || !email || !password || !password2) {
      return alert("msg: All fields are required");
    }
    if (password !== password2) {
      return alert("Passwords don't match");
    }

    try {
      const response = await axios.post("http://localhost:8080/users/register", {
        username,
        email,
        password,
      });
      // Handle successful registration
      console.log(response);
      alert(response.data.msg); // Display the success message from backend

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store the token if it exists
      }
      navigate("/");

    } catch (error) {
      // Handle errors
      if (error.response) {
        // Specific error: Duplicate email
        if (error.response.data.msg === "A user with this email already exists") {
          alert("This email is already registered. Please use a different email.");
        } else {
          // Generic server-side error
          console.error("Server responded with error:", error.response.data);
          alert("An unexpected error occurred. Please try again.");
        }
      } else {
        // Client-side or network errors
        console.error("Unexpected error during registration:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable button after the request is done
    }
  };




  return (

    <div className="">


      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={newUser.username}
          placeholder="Username"
          onChange={handleChange}
          required
          autoComplete="username"
          onKeyDown={handleEnter}
          className=""

        />

        <input
          type="email"
          name="email"
          value={newUser.email}
          placeholder="Email"
          onChange={handleChange}
          required
          autoComplete="email"
          onKeyDown={handleEnter}
          className=""

        />
        <input
          type="password"
          name="password"
          value={newUser.password}
          placeholder="Password"
          onChange={handleChange}
          required
          autoComplete="new-password" // Added
          onKeyDown={handleEnter}
          className=""

        />
        <input
          type="password"
          name="password2"
          value={newUser.password2}
          placeholder="Confirm password"
          onChange={handleChange}
          required
          autoComplete="new-password"
          onKeyDown={handleEnter}
          className=""
        />
        <button className="" type="submit" disabled={isSubmitting}>Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <button className="" onClick={() => navigate("/login")} >
          Log In
        </button>
      </p>


    </div>

  );
}

export default Register;