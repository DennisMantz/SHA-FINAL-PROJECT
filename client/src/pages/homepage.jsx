import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import BookmarkManager from "./bookmarks";

function Homepage() {
    const navigate = useNavigate();



    return (
        <div className=" h-full xl:h-screen w-full bg-gray-200">
            <Navbar />
            <section className=""> 
                {/* hidden sm:block if you choose to hide on mobile since hover + bookmarks doesn't make sense */}
               <BookmarkManager/>
            </section>
            
            <main className="grid grid-cols-1 xl:grid-cols-3  grid-rows-6 sm:grid-rows-3 xl:grid-rows-1   items-center  gap-5  mt-20">

                <section className="max-w-[800px] grid sm:grid-cols-2 mx-auto  items-center">
                    <div className="grid  justify-center items-center ">
                        <button className=" mx-auto w-[180px] h-[100px]  border rounded-lg border-gray-800 text-3xl font-bold text-white hover:scale-105  bg-gray-800 mb-3" onClick={() => navigate("/Cards")}>ShareBro</button>

                        <p className="w-[250px] text-center text-lg mb-2 font-bold text-gray-900">-Share your socials<br></br>-Promote your business<br></br>-Showcase your projects<br></br>-Create CV-style cards for any job application<br></br> All in one place! </p>
                    </div>
                    <img className=" mx-auto h-[450px] " src="/assets/ShareBro.PNG" alt="logo" />

                </section>


                <section className="max-w-[800px] grid sm:grid-cols-2 mx-auto  items-center">
                    <div className="grid  justify-center items-center ">
                        <button className="cursor-not-allowed mx-auto w-[180px] h-[100px]  border rounded-lg border-gray-800 text-3xl font-bold text-white   bg-gray-800 mb-3" >MedBro</button>

                        <p className="w-[250px] text-center text-lg mb-2 font-bold text-gray-900">🚧Under Construction🚧</p>
                        <img className="xl:w-[220px] justify-self-end  " src="/assets/truck-ramp-box-solid1.svg" alt="logo" />
                        </div>
                    <img className=" mx-auto h-[450px] " src="/assets/MedBro-last.PNG" alt="logo" />

                </section>


                <section className="max-w-[800px] grid sm:grid-cols-2 mx-auto  items-center">
                    <div className="grid  justify-center items-center ">
                        <button className="cursor-not-allowed mx-auto w-[180px] h-[100px]  border rounded-lg border-gray-800 text-3xl font-bold text-white   bg-gray-800 mb-3" >DocBro</button>

                        <p className="w-[250px] text-center text-lg mb-2 font-bold text-gray-900">🚧Under Construction🚧</p>
                        <img className=" xl:w-[220px]  justify-self-end" src="/assets/truck-ramp-box-solid1.svg" alt="logo" />
                        </div>
                    <img className=" mx-auto h-[450px] " src="/assets/DocBro-last.PNG" alt="logo" />

                </section>
            </main>
        </div>
    );
}
export default Homepage;

