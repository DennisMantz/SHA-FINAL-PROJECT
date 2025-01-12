import React, { useState } from "react";
import LogoutButton from "./logoutButton";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-[15%]  xl:h-[20%] min-w-screen grid grid-cols-[1fr_auto_1fr] items-center bg-gray-800 text-white">
      {/* Left Placeholder (dropdown menu) */}
      <div></div>

      {/* Centered Logo */}
      <img
        onClick={() => navigate("/")}
        className="h-[150px] xl:h-[180px] cursor-pointer hover:scale-110 p-4"
        src="/assets/syncBro-WHITE-ALIGNED.png"
        alt="logo"
      />

      
      <div className=" p-4 justify-self-end mr-3">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className=" hover:scale-110"
        >
          <img src="/assets/bars-solid1.svg" alt="menu" className="w-6 hidden sm:block"/>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-[110px] xl:top-[140px] right-[10px] bg-gray-800 opacity-95 rounded-lg  w-[180px] text-center  shadow-sm shadow-gray-100  border-gray-100 z-[9999]">
            
            <button
            title="Home"
              onClick={() => {
                setDropdownOpen(false);
                navigate("/"); 
              }}
              className="block text-right mr-4 text-white py-2 px-4 font-bold w-full hover:scale-110  text-lg"
            >
              SyncBro 🏠
            </button>
            <button
              title="Cards"
              onClick={() => {
                setDropdownOpen(false);
                navigate("/Cards"); 
              }}
             className="block text-right mr-4 text-white py-2 px-4 hover:scale-110 font-bold w-full text-lg"
            >
              ShareBro 💳
            </button>
            <button
            title="Coming soon"
              // onClick={() => {
              //   setDropdownOpen(false);
              //   navigate("/"); 
              // }}
             className="block text-right mr-4 text-red-900 py-2 px-4  font-bold w-full text-lg cursor-not-allowed"
            >
              MedBro  🚧
            </button>
            <button
              title="Coming soon"
              // onClick={() => {
              //   setDropdownOpen(false);
              //   navigate("/"); 
              // }}
             className="block text-right mr-4 text-red-900 py-2 px-4  font-bold w-full text-lg cursor-not-allowed"
            >
              DocBro  🚧
            </button>
            {/* Logout Button */}
            <LogoutButton />
          </div>
          
        )}
        
      </div>
    </header>
  );
}

export default Navbar;
