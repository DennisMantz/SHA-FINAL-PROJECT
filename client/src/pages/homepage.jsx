import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import BookmarkManager from "./bookmarks";

function Homepage() {
    const navigate = useNavigate();



    return (
        <div className="h-full w-full bg-gray-200">
            <Navbar />
            <section>
               <BookmarkManager/>
            </section>
            
            <main className="grid grid-cols-1  grid-rows-6 sm:grid-rows-3   items-center  gap-5 mt-20">

                <section className="max-w-[800px] grid sm:grid-cols-2 mx-auto  items-center">
                    <div className="grid  justify-center items-center ">
                        <button className=" mx-auto w-[180px] h-[100px]  border rounded-lg border-gray-800 text-3xl font-bold text-white hover:scale-105  bg-gray-800 mb-3" onClick={() => navigate("/Cards")}>ShareBro</button>

                        <p className="w-[250px] text-center text-lg mb-2 font-bold text-gray-900">-Share your socials<br></br>-Promote your business<br></br>-Showcase your projects<br></br>-Create CV style cards for every job application<br></br> All in one place!" </p>
                    </div>
                    <img className=" mx-auto h-[450px] " src="/assets/CardSNIP1.PNG" alt="logo" />

                </section>


                <section className="max-w-[800px] grid sm:grid-cols-2 mx-auto  items-center">
                    <div className="grid  justify-center items-center ">
                        <button className=" mx-auto w-[180px] h-[100px]  border rounded-lg border-gray-800 text-3xl font-bold text-white hover:scale-105  bg-gray-800 mb-3" >MedBro</button>

                        <p className="w-[250px] text-center text-lg mb-2 font-bold text-gray-900">🚧Under construction🚧</p>
                        <img className="   " src="/assets/truck-ramp-box-solid1.svg" alt="logo" />
                        </div>
                    <img className=" mx-auto h-[450px] " src="/assets/MedBro1.PNG" alt="logo" />

                </section>


                <section className="max-w-[800px] grid sm:grid-cols-2 mx-auto  items-center">
                    <div className="grid  justify-center items-center ">
                        <button className=" mx-auto w-[180px] h-[100px]  border rounded-lg border-gray-800 text-3xl font-bold text-white hover:scale-105  bg-gray-800 mb-3" >DocBro</button>

                        <p className="w-[250px] text-center text-lg mb-2 font-bold text-gray-900">🚧Under construction🚧</p>
                        <img className="   " src="/assets/truck-ramp-box-solid1.svg" alt="logo" />
                        </div>
                    <img className=" mx-auto h-[450px] " src="/assets/DocBro1.PNG" alt="logo" />

                </section>
            </main>
        </div>
    );
}
export default Homepage;

