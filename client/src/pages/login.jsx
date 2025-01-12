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
        <div className="grid grid-cols-3 w-full min-h-screen">

            <div className="col-span-2 bg-gray-200">

                <div className="flex flex-col justify-center items-center h-screen">
                    {/* <h2 className="">Login</h2> */}
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
                </div>
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

            <div className="col-span-1 bg-gray-800 w-full shadow-lg shadow-gray-900">
                <div className="w-full mx-auto  flex justify-center mt-10">
                    <img src="/assets/syncBro-WHITE-ALIGNED.png" alt="logo" className=" max-w-[300px] " />
                </div>
                <div className="w-full mx-auto  flex justify-center">
                    <p className="text-white text-lg italic"> One app to rule them all! </p>
                </div>

                <div className="w-full mx-auto grid justify-center mt-[50px] max-w-[300px]">
                    {/* <p className="text-white font-bold text-2xl">Features:</p> */}
                    <p className="text-white text-lg">
                        <strong>Bookmark Groups</strong> to organize tasks and manage multiple links efficiently.
                    </p>
                    <p className="text-white text-lg mt-4">
                        <strong>Online Cards</strong>, now available through <strong>ShareBRO</strong>, let you share your socials, promote your business, or create CV-like cards with just a single link.
                    </p>
                    <p className="text-white text-lg mt-4">
                        <strong>Coming Soon:</strong> Digitally save your exam papers, so you never need a hard copy again, and set reminders for retakes.
                    </p>
                    <p className="text-white text-lg mt-4">
                        <strong>Coming Soon:</strong> Organize and manage your adult chores seamlessly with a yearly planner.
                    </p>
                </div>

            </div>
        </div>
    );
}
export default Login;