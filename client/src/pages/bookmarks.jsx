import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function BookmarkManager() {
    const [bookmarks, setBookmarks] = useState([]);
    const [newBookmark, setNewBookmark] = useState({ title: "", links: [""] });
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingBookmarkId, setEditingBookmarkId] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    // Fetch bookmarks
    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const { data } = await axios.get("http://localhost:8080/bookmarks", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setBookmarks(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
                setBookmarks([]);
            }
        };

        fetchBookmarks();
    }, []);

    // Handle form changes
    const handleFormChange = (index, value) => {
        const updatedLinks = [...newBookmark.links];
        updatedLinks[index] = value;
        setNewBookmark({ ...newBookmark, links: updatedLinks });
    };

    // Add link field
    const addLinkField = () => {
        if (newBookmark.links.length < 10) {
            setNewBookmark({ ...newBookmark, links: [...newBookmark.links, ""] });
        } else {
            alert("You can add up to 10 links only.");
        }
    };

    // Save or update bookmark
    const saveOrUpdateBookmark = async () => {
        try {
            if (!newBookmark.title.trim()) {
                Swal.fire({
                    title: "Invalid Title",
                    text: "Please provide a valid title.",
                    icon: "error",
                    confirmButtonText: "Okay",
                });
                return;
            }

            const hasValidLink = newBookmark.links.some((link) => link.trim());
            if (!hasValidLink) {
                Swal.fire({
                    title: "Invalid Links",
                    text: "Please provide at least one valid link.",
                    icon: "error",
                    confirmButtonText: "Okay",
                });
                return;
            }

            const formattedLinks = newBookmark.links
                .filter((link) => link.trim())
                .map((link) => ({ url: link }));

            if (isEditing) {
                const { data } = await axios.put(
                    `http://localhost:8080/bookmarks/${editingBookmarkId}`,
                    { ...newBookmark, links: formattedLinks },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                setBookmarks(
                    bookmarks.map((bookmark) =>
                        bookmark._id === editingBookmarkId ? data : bookmark
                    )
                );
            } else {
                const { data } = await axios.post(
                    "http://localhost:8080/bookmarks",
                    { ...newBookmark, links: formattedLinks },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                setBookmarks([...bookmarks, data]);
            }

            setNewBookmark({ title: "", links: [""] });
            setShowForm(false);
            setIsEditing(false);
            setEditingBookmarkId(null);
        } catch (error) {
            console.error("Error saving or updating bookmark:", error);
        }
    };

    // Delete bookmark with confirmation
const deleteBookmark = async (id) => {
    // Show confirmation modal
    Swal.fire({
        title: "Sure?",
        text: "This action will permanently delete the bookmark group.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/bookmarks/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setBookmarks(bookmarks.filter((bookmark) => bookmark._id !== id));
                Swal.fire("Deleted!", "The bookmark group has been deleted.", "success");
            } catch (error) {
                console.error("Error deleting bookmark:", error);
                Swal.fire("Error", "There was an issue deleting the bookmark. Please try again.", "error");
            }
        }
    });
};

const handleAddBookmarkClick = () => {
    if (!localStorage.getItem("token")) {
        // Redirect to login if the user is not logged in
        Swal.fire({
            title: "Not Logged In",
            text: "You need to log in to add a bookmark.",
            icon: "warning",
            confirmButtonText: "Go to Login",
        }).then(() => {
            navigate("/login"); // Programmatically navigate to the login page
        });
        return;
    }

    if (bookmarks.length >= 10) {
        Swal.fire({
            title: "Limit Reached",
            text: "You can only have up to 10 bookmarks.",
            icon: "warning",
            confirmButtonText: "Okay",
        });
        return;
    }

    // Open the form to add a bookmark
    setNewBookmark({ title: "", links: [""] });
    setShowForm(true);
    setIsEditing(false);
};

    // Open links in new tabs
    const openLinks = (links) => {
        const formattedLinks = links.map((link) => {
            const url = link.url; // Use the original URL
            const displayText = url.length > 40 ? `${url.substring(0, 40)}...` : url; // Shorten display text if too long
            return `<a 
                        href="https://${url}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="text-blue-800  hover:text-blue-700 hover:scale-110 hover:ml-4 block" 
                        title="${url}"> <!-- Full URL is displayed on hover -->
                        ${displayText}
                    </a>`;
        }).join("");
    
        Swal.fire({
            title: "Hold Ctrl/Cmd + Click on links to open multiple tabs",
            html: `
                <div class="text-left text-lg">
                    ${formattedLinks}
                </div>`,
            icon: "info",
            confirmButtonText: "Close",
            width: 600,
            showCloseButton: true,
            customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                htmlContainer: 'custom-swal-html',
                confirmButton: 'custom-swal-confirm',
            },
        });
    };
    
    
    

    // Open edit form
    const openEditForm = (bookmark) => {
        setNewBookmark({
            title: bookmark.title,
            links: bookmark.links.map((link) => link.url),
        });
        setEditingBookmarkId(bookmark._id);
        setIsEditing(true);
        setShowForm(true);
    };

    return (
        <div className="">
            <div className="max-w-[1200px] mx-auto  grid grid-rows-1">

                {/* Bookmark Modal */}
                {showForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-gray-100 rounded p-6 w-[400px] shadow-lg">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">
                                {isEditing ? "Edit Bookmark Group" : "Add Bookmark Group"}
                            </h2>
                            <input
                                type="text"
                                placeholder="Title"
                                value={newBookmark.title}
                                onChange={(e) =>
                                    setNewBookmark({ ...newBookmark, title: e.target.value })
                                }
                                className="mb-2 p-2 border w-full"
                                maxLength={9}
                            />
                            {newBookmark.links.map((link, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    placeholder="Link"
                                    value={link}
                                    onChange={(e) => handleFormChange(index, e.target.value)}
                                    className="mb-2 p-2 border w-full"
                                />
                            ))}
                            <button
                                className="mb-2 px-4 py-2 bg-green-700 text-white rounded hover:scale-110"
                                onClick={addLinkField}
                            >
                                Add Link
                            </button>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="px-4 py-2 bg-gray-800 text-white rounded hover:scale-110"
                                    onClick={saveOrUpdateBookmark}
                                >
                                    Save
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-800 text-white rounded hover:scale-110"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Display Bookmarks */}
                <div className={`grid grid-cols-2 sm:grid-cols-5  mx-auto sm:max-w-[600px] gap-x-5 gap-y-3 mt-2 relative ${bookmarks.length > 4 || bookmarks.length === 0 ? 'sm:grid-cols-5' : 'sm:flex'} `}>
                    <div className={`  left-[-50px]  ${ bookmarks.length < 6 ? 'w-auto  ' : 'w-[150px] my-[26px] left-[-115px]'} absolute`}>
                        <button
                            title={`${bookmarks.length > 9 ? `10 = max, cause why not?` : `Add Bookmark`}`}
                            className={`flex justify-center mx-auto ${bookmarks.length > 0 ? 'w-auto' : 'w-[150px]'} ${bookmarks.length > 9 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={handleAddBookmarkClick}
                        >
                            <img src="/assets/circle-plus-sm.svg" alt="Add Link" className="bg-white w-7 h-7 rounded-full" />
                            {bookmarks.length === 0 && <p className="w-full">Add bookmarks</p>}
                        </button>
                    </div>

                    {bookmarks.map((bookmark) => (
                        <div
                            key={bookmark._id}
                            className="bg-gray-800 text-white max-w-[95px] p-1 rounded relative group hover:scale-110"
                        >
                            {/* Title button */}
                            <button
                                title="Show Links"
                                className="hover:scale-110  text-center w-[80px]"
                                onClick={() => openLinks(bookmark.links)}
                            >
                                {bookmark.title}
                            </button>

                            {/* Edit and Delete buttons (shown on hover, positioned outside) */}
                            <div className="absolute top-[-5px] left-[-21%] flex flex-col  opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    title="Edit"
                                    className="hover:scale-105  p-1 rounded mb-[-3px]"
                                    onClick={() => openEditForm(bookmark)}
                                >
                                    <img src="/assets/gear-solid.svg" alt="Edit" className="w-[15px] mr-[-2px] hover:scale-125" />
                                </button>
                                <button
                                    title="Delete"
                                    className="hover:scale-105  p-1 rounded mt-[-1px]"
                                    onClick={() => deleteBookmark(bookmark._id)}
                                >
                                    <img src="/assets/trash-can-solid.svg" alt="Delete" className="w-[14px] hover:scale-125" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>



            </div>

        </div>
    );
}

export default BookmarkManager;
