import React from "react";
import LogoutButton from "./logoutButton";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="h-[15%] min-w-screen grid grid-cols-[1fr_auto_1fr] items-center bg-gray-800 text-white ">
  {/* Left Placeholder (empty, but can be used for other elements later) */}
  <div></div>

  {/* Centered Logo */}
  <img
    onClick={() => navigate("/")}
    className="h-[125px] cursor-pointer  hover:scale-125 p-4"
    src="/assets/syncBro-WHITE-ALIGNED.png"
    alt="logo"
  />
  {/* <video
  onClick={() => navigate("/")}
  className="h-[125px] cursor-pointer hover:scale-125 p-4"
  src="/assets/syncBro-neonEnter.mp4"
  autoPlay
  loop
  muted
  playsInline
>
  Your browser does not support the video tag.
</video> */}

  {/* Logout Button */}
  <div className="justify-self-end p-4">
    <LogoutButton />
  </div>
</header>
  );
}

export default Navbar;
