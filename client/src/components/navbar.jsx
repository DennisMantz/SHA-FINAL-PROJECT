import React from "react";
import LogoutButton from "./logoutButton";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

  return (
    <header className="h-[15%] w-full flex justify-between items-center bg-gray-800 text-white p-4">
            
                <img onClick={()=> navigate("/")} className="h-20 cursor-pointer hover:scale-125" src="/assets/syncBro.png" alt="logo" />
            <LogoutButton />
            </header>
  );
}

export default Navbar;
