import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <button className="block text-right mr-4 text-white py-2 px-4 hover:scale-110 font-bold w-full text-lg" onClick={handleLogout} >
      Logout 🤢
    </button>
  );
}

export default LogoutButton;
