import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";

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
        <div className="">
            <Navbar />




            <div className="grid grid-rows-3 sm:grid-cols-3  " >
                {cards.map((card) => (
                    <div
                        key={card._id}
                        className="border-2 border-gray-800 m-3 p-3 cursor-pointer w-[200px] text-center  mx-auto  h-[180px] flex flex-col justify-between "
                    >
                        <div onClick={() => navigate(`/businessCard/${card._id}`)} // Use the card's unique ID
                            className="hover:scale-110">
                                 <img
                                src={
                                    card.cardPicture ||
                                    "data:image/png;base64,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"
                                }
                                alt="Profile"
                                className="w-[50px] h-[50px] rounded-full object-cover mx-auto"
                                
                            />
                            <p className="text-sm">Card Name:</p>
                            <h2 className="text-lg font-bold">
                                {card.cardTitle || ""}
                            </h2>
                           
                        </div>
                        <button className="mt-10 text-red-600 hover:scale-110"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent navigation on delete
                                handleDeleteCard(card._id);
                            }}

                        >
                            Delete Card
                        </button>
                    </div>
                ))}
            </div>




            {/* Add New Card Button, hidden if limit reached */}
            {canAddCard ? (
                <div className="flex justify-center">
                    <button className="bg-gray-800 m-2 text-white border rounded-full p-2 font-bold hover:scale-105 " onClick={handleAddCard} disabled={loading}>
                        {loading ? "Loading..." : "Bro! Hit me"}
                    </button>
                </div>
            ) : (
                <p className="flex justify-center">BRUH! Really? 9?</p>
            )}
        </div>
    );
}

export default AllCards;