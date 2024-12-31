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
    <button className="cursor-pointer hover:scale-105 font-bold text-lg" onClick={handleLogout} >
      Logout
    </button>
  );
}

export default LogoutButton;
