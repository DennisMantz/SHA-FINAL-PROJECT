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
                                    card.cardPicture
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