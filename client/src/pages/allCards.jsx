import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AllCards() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get("http://localhost:8080/cards", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCards(response.data); // Assuming response.data is an array of cards
      } catch (error) {
        console.error("Error fetching cards:", error);
        alert("Error loading cards. Please try again.");
      }
    };

    fetchCards();
  }, []);

  const handleAddCard = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/cards",
        {
          cardFirstName: "",
          cardLastName: "",
          cardAbout: "New card about section",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCards((prevCards) => [...prevCards, response.data.createCard]);
    } catch (error) {
      console.error("Error adding new card:", error);
      alert("Error creating new card.");
    }
  };

  return (
    <div>
      <h1>Your Business Cards</h1>
      <button onClick={handleAddCard}>Add New Card</button>
      <div>
        {cards.map((card) => (
          <div
            key={card._id}
            onClick={() => navigate(`/businessCard/${card._id}`)}
            style={{ border: "1px solid black", margin: "10px", padding: "10px" }}
          >
            <h2>
              {card.cardFirstName} {card.cardLastName}
            </h2>
            <p>{card.cardAbout}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllCards;