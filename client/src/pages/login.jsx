import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    function handleChange(e) {
        try {
            let { name, value } = e.target
            setLoginData({ ...loginData, [name]: value })
        } catch (error) {
            console.log(`Error input update: ${error}`)
        }
    }

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            pressLogin();
        }
    };

    function handleSubmit(e) {
        e.preventDefault();
        pressLogin();
    }

    const pressLogin = async () => {
        if (isSubmitting) return; // Prevent double-submit

        setIsSubmitting(true); // Disable button while submitting

        try {
            const { email, password } = loginData;

            if (!email || !password) {
                return alert("Both fields are required");
            }

            const response = await axios.post(
                `http://localhost:8080/users/login`,
                loginData
            );
            if (response.status === 200) {
                const { token, msg } = response.data;
                localStorage.setItem("token", token); // Store the token
                alert(msg); // Display success message
                navigate("/"); // Redirect to homepage
            }
        } catch (error) {
            if (error.response) {
                // Handle backend error messages
                const { msg } = error.response.data;
                console.error("Server error:", msg);
                alert(msg || "An unexpected server error occurred.");
            } else {
                // Handle network or client-side errors
                console.error("Unexpected error during login:", error);
                alert("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false); // Re-enable button after request completion
        }
    };


    return (
        <div className="">


            <h2 className="">Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    onKeyDown={handleEnter}
                    className=""
                />
                <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    onKeyDown={handleEnter}
                    className=""
                />
                <button
                    type="submit"
                    className=""
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="">
                Don't have an account?{" "}
                <button className=""
                    onClick={() => navigate("/register")}>
                    <span className=" ">
                        Sign Up
                    </span>
                </button>
            </p>

        </div>
    );
}
export default Login;