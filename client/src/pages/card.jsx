import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

function Card() {
  const navigate = useNavigate();

  
  // State for card data
  const [card, setCard] = useState({
    cardFirstName: "",
    cardLastName: "",
    cardBackgroundColor: "#FFFFFF",
    cardSocialLinks: null, // Initialize as `null` to differentiate loading state
    cardProjectLinks: null,
  });

  const { cardFirstName, cardLastName, cardBackgroundColor, cardSocialLinks, cardProjectLinks } = card;
  const { id } = useParams();
  // Fetch card data from the backend
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get(`http://localhost:5173/cards/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust token retrieval if necessary
          },
        });
        setCard(response.data);
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchCardData();
  }, [id]);

  // Handle color change
  const handleBackgroundColorChange = (e) => {
    setCard((prevCard) => ({
      ...prevCard,
      cardBackgroundColor: e.target.value,
    }));
  };

  return (
    <div>
      <h1>Business Card</h1>

      {/* Card Display */}
      <div style={{ backgroundColor: cardBackgroundColor, padding: "20px", borderRadius: "8px" }}>
        <h2>
          {cardFirstName} {cardLastName}
        </h2>
        {/* Social Links */}
        <div>
          <h3>Social Links</h3>
          {cardSocialLinks?.length > 0 ? (
            cardSocialLinks.map((social, index) => (
              <p key={index}>
                <a href={social.link} target="_blank" rel="noopener noreferrer">
                  {social.title}
                </a>
              </p>
            ))
          ) : (
            <input
                    // type="password"
                    // name="password"
                    // value={}
                    // placeholder="Password"
                    // onChange={}
                    // required
                    // autoComplete="current-password"
                    // onKeyDown={}
                    // className=""
                />
          )}
        </div>
        {/* Project Links */}
        <div>
          <h3>Project Links</h3>
          {cardProjectLinks?.length > 0 ? (
            cardProjectLinks.map((project, index) => (
              <p key={index}>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  {project.title}
                </a>
              </p>
            ))
          ) : (
            <input
            // type="password"
            // name="password"
            // value={}
            // placeholder="Password"
            // onChange={}
            // required
            // autoComplete="current-password"
            // onKeyDown={}
            // className=""
        />
          )}
        </div>
      </div>

      {/* Background Color Picker */}
      <div style={{ marginTop: "20px" }}>
        <label htmlFor="backgroundColor">Choose a background color:</label>
        <input
          type="color"
          id="backgroundColor"
          name="backgroundColor"
          value={cardBackgroundColor || "#FFFFFF"} // Use fallback if cardBackgroundColor is undefined
          onChange={handleBackgroundColorChange}
        />
      </div>
    </div>
  );
}

export default Card;
