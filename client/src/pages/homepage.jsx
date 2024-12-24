import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Homepage() {
  const navigate = useNavigate();



    return (
        <div>
            <footer className="">
                <p>Logo</p>
                <p>Profile picture</p>
            </footer>

            <section>
                <p>Bookmarks</p>
            </section>

            <main>
                <section>
                    <button onClick={() => navigate("/businessCard/:id")}>BuisnessCard</button>
                    <button onClick={() => navigate("/businessCards")}>BuisnessCards</button>
                    </section>
                <section>MedCard</section>
                <section>DocSave</section>
            </main>



        </div>
    );
}
export default Homepage;

