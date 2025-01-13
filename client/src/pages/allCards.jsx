import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Swal from "sweetalert2";


const API_URL = import.meta.env.MODE === "development"
  ? import.meta.env.VITE_API_URL_LOCAL
  : import.meta.env.VITE_API_URL_PROD;
console.log("Using API URL:", API_URL);


function AllCards() {
    const [cards, setCards] = useState([]); // Holds the user's cards
    const [canAddCard, setCanAddCard] = useState(true); // Determines if the "Add Card" button is visible
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();



    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get(`${API_URL}/cards`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const userCards = response.data; //  response.data =? array of cards
                setCards(userCards);

                if (userCards.length >= 12) {
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
                `${API_URL}/cards`,
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
            if (cards.length + 1 >= 12) {
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
            await axios.delete(`${API_URL}/cards/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Update state to remove the deleted card
            setCards((prevCards) => prevCards.filter((card) => card._id !== id));

            // Re-enable "Add Card" button if the limit is no longer reached
            if (cards.length - 1 < 12) {
                setCanAddCard(true);
            }
        } catch (error) {
            console.error("Error deleting card:", error);
            alert("Error deleting card.");
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    const confirmDeleteCard = (id) => {
        Swal.fire({
            title: "Delete that Broski??",
            text: "No backsies!! Recycle the Garbagio!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33", // Red for delete
            cancelButtonColor: "#1f2937", // Blue for cancel
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteCard(id); // Call the delete handler if confirmed
                Swal.fire("Deleted!", "The card has been deleted.", "success");
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <Navbar />

            {/* Main Content Container */}
            <div className="flex flex-col flex-1 max-w-full mx-auto ">
                {/* Add New Card Button */}
                <div
                    className={`flex justify-center`}
                >
                    {canAddCard ? (
                        <button
                            className="bg-gray-800 m-2 text-white border rounded-full p-2 font-bold hover:scale-105 h-[42px] "
                            onClick={handleAddCard}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Bro! Hit me"}
                        </button>
                    ) : (
                        <p className="flex justify-center">BRUH! Really? 12?</p>
                    )}
                </div>

                {/* Cards Grid */}
                <div className="grid grid-rows-auto sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">



                    {cards.map((card) => (
                        <div
                            key={card._id}
                            className="relative  cursor-pointer w-[200px] sm:w-[280px] lg:w-[230px] text-center  h-[220px]  bg-gray-300 rounded-3xl border border-gray-400  p-4 hover:scale-105"
                            title="Preview"
                        >
                            <div
                                onClick={() => navigate(`/shareBro/${card._id}`)}
                                className="hover:scale-110 w-full h-full flex flex-col items-center justify-between "
                            >
                                <img
                                    
                                    src={card.cardPicture}
                                    alt="Profile"
                                    className="w-[100px] h-[100px] rounded-full object-cover "
                                />
                                <div className=""> 
                                <p className="text-sm">Card Name:</p>
                                <h2 className="text-md font-bold">{card.cardTitle || ""}</h2>
                                </div>
                            <div className="flex justify-center items-end w-full"> 
                                <img
                                title="Edit"
                                src="/assets/user-pen-sm.svg"
                                className=" text-red-600 hover:scale-125 w-[25px] "
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent navigation on delete
                                    navigate(`/shareBro/${card._id}`, { state: { isEditing: true } }); // Pass isEditing: true
                                }}
                            />
                            <img
                                title="Delete"
                                src="/assets/user-slash-sm.svg"
                                className="  hover:scale-125 w-[25px] "
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent navigation on delete
                                    confirmDeleteCard(card._id); // Show confirmation dialog
                                }}
                            />
                            </div>
                            </div>
                            {/* <button
                                className=" text-red-600 hover:scale-110 w-[100px] mx-auto"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent navigation on delete
                                    confirmDeleteCard(card._id); // Show confirmation dialog
                                }}
                            >
                                Delete Card
                            </button> */}
                            
                            
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );

}

export default AllCards;