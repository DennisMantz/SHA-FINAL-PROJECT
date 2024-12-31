import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";

function Homepage() {
    const navigate = useNavigate();



    return (
        <div className="h-full w-full bg-[rgba(201,211,212,0.16)]">
            <Navbar />
            <section>
                <p className="mx-auto mt-1 flex justify-center rounded border-2 border-gray-800 w-1/3">STEP4--Bookmark Controller </p>
            </section>

            <main className="grid grid-rows-3 sm:grid-cols-3 mt-10  ">

                <section className="w-[200px] mx-auto text-center">
                    
                    <button className="  w-[180px] h-[100px]  border rounded-lg border-gray-800 text-3xl font-bold text-white hover:scale-105 bg-gray-800 mb-3" onClick={() => navigate("/businessCards")}>ShareBro</button>
                    
                    <p className="text-md mb-2 font-bold text-gray-900">Create and share personalized cards to share your socials, apply for jobs, or promote your business!</p>
                    <img className=" mx-auto h-[300px] " src="/assets/CardSNIP.PNG" alt="logo" />
                    
                </section>
                

                <section className="w-[200px] mx-auto text-center">
                    <button className="  w-[180px] h-[100px]  border rounded-lg border-gray-800 text-3xl font-bold text-white hover:scale-105 bg-gray-800 mb-3" onClick={() => navigate("/businessCards")}>MedBro</button>
                    
                    <p className="text-md mb-2 font-bold text-gray-900">STEP2</p>
                    <img className=" mx-auto h-[300px] " src="/assets/MedBro.PNG" alt="logo" />
                    
                </section>

               
                <section className="w-[200px] mx-auto text-center">
                    <button className="  w-[180px] h-[100px]  border rounded-lg border-gray-800 text-3xl font-bold text-white hover:scale-105 bg-gray-800 mb-3" onClick={() => navigate("/businessCards")}>DocBro</button>
                    
                    <p className="text-md mb-2 font-bold text-gray-900">STEP3</p>
                    <img className=" mx-auto h-[300px] " src="/assets/DocBro.PNG" alt="logo" />
                    
                </section>

               
            </main>



        </div>
    );
}
export default Homepage;

