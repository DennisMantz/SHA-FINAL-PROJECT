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
    <button onClick={handleLogout} style={{ cursor: "pointer" }}>
      Logout
    </button>
  );
}

export default LogoutButton;
