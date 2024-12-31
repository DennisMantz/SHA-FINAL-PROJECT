import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutButton from "../components/logoutButton";

function Homepage() {
  const navigate = useNavigate();



    return (
        <div className="bg-red-500">
            <LogoutButton />
            <footer className="">
                <p className="text-red-500">Logo</p>
                <p>Profile picture</p>
            </footer>

            <section>
                <p>Bookmarks</p>
            </section>

            <main>
                <section>
                    
                    <button onClick={() => navigate("/businessCards")}>BuisnessCards</button>
                    </section>
                <section>MedCard</section>
                <section>DocSave</section>
            </main>



        </div>
    );
}
export default Homepage;

