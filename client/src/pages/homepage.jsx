import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";

function Homepage() {
  const navigate = useNavigate();



    return (
        <div className="h-screen w-full bg-[rgba(201,211,212,0.16)]">
            <Navbar />
            <section>
                <p className="m-auto flex justify-center bg-red-200 w-1/3">Bookmark Controller PART4</p>
            </section>

            <main className="flex justify-around mt-10">

                <section className="rounded border-2 border-gray-800  p-3  text-center "> 
                    <button className="  pl-2 pr-2 border rounded-lg border-gray-800 text-3xl font-bold text-white hover:scale-105 bg-gray-800 mb-3" onClick={() => navigate("/businessCards")}>ShareBro</button>
                    <p className="text-sm">Create and share personalized cards <br>
                    </br>to share your socials, apply for jobs, <br>
                    </br>or promote your business!</p>

                    </section>

                <section>MedCard</section>
                <section>DocSave</section>
            </main>



        </div>
    );
}
export default Homepage;

