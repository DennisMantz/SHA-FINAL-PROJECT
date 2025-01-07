import React from "react";
import LogoutButton from "./logoutButton";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="h-[15%] w-full grid grid-cols-[1fr_auto_1fr] items-center bg-gray-800 text-white p-4">
  {/* Left Placeholder (empty, but can be used for other elements later) */}
  <div></div>

  {/* Centered Logo */}
  <img
    onClick={() => navigate("/")}
    className="h-20 cursor-pointer hover:scale-125"
    src="/assets/syncBro.png"
    alt="logo"
  />

  {/* Logout Button */}
  <div className="justify-self-end">
    <LogoutButton />
  </div>
</header>
  );
}

export default Navbar;
