import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AllCards() {
    const [cards, setCards] = useState([]); // Holds the user's cards
    const [canAddCard, setCanAddCard] = useState(true); // Determines if the "Add Card" button is visible
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get("http://localhost:8080/cards", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const userCards = response.data; // Assuming response.data is an array of cards
                setCards(userCards);
                // Check if the user already has 9 cards
                if (userCards.length >= 9) {
                    setCanAddCard(false); // Disable "Add Card" button if the limit is reached
                }
            } catch (error) {
                console.error("Error fetching cards:", error);
                alert("Error loading cards. Please try again.");
            }
        };

        fetchCards();
    }, []);

    // Handle adding a new card
    const handleAddCard = async () => {
        setLoading(true); // Show loading indicator
        try {
            const response = await axios.post(
                "http://localhost:8080/cards",
                {}, // Empty body since defaults are handled by the backend schema
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const newCard = response.data.card;
            // Update state with the new card
            setCards((prevCards) => {
                const updatedCards = [...prevCards, newCard];
                return updatedCards; // Trigger React re-render
            });

            // Disable "Add Card" button if adding this card reaches the limit
            if (cards.length + 1 >= 9) {
                setCanAddCard(false);
            }
        } catch (error) {
            console.error("Error adding new card:", error);
            alert("Error creating new card.");
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    // Handle deleting a card
    const handleDeleteCard = async (id) => {
        setLoading(true); // Show loading indicator
        try {
            await axios.delete(`http://localhost:8080/cards/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Update state to remove the deleted card
            setCards((prevCards) => prevCards.filter((card) => card._id !== id));

            // Re-enable "Add Card" button if the limit is no longer reached
            if (cards.length - 1 < 9) {
                setCanAddCard(true);
            }
        } catch (error) {
            console.error("Error deleting card:", error);
            alert("Error deleting card.");
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };



    return (
        <div>
            <button onClick={() => navigate("/")}>Back</button>
            <p>This feature allows for creating and sharing any card, from business cards for your clients showcasing your work, socials for your friends to CV related information.</p>
            {/* Add New Card Button, hidden if limit reached */}
            {canAddCard ? (
                <button onClick={handleAddCard} disabled={loading}>
                    {loading ? "Loading..." : "Add New Card"}
                </button>
            ) : (
                <p>You have reached the maximum card limit of 9.</p>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {cards.map((card) => (
                    <div
                        key={card._id}
                        onClick={() => navigate(`/businessCard/${card._id}`)} // Use the card's unique ID
                        style={{
                            border: "1px solid black",
                            margin: "10px",
                            padding: "10px",
                            cursor: "pointer",
                            width: "200px",
                            textAlign: "center",
                        }}
                    >
                        <h2>
                            {card.cardTitle || "First Name"}
                        </h2>

                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent navigation on delete
                                handleDeleteCard(card._id);
                            }}
                            style={{ marginTop: "10px", color: "red" }}
                        >
                            Delete Card
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllCards;