import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function BookmarkManager() {
    const [bookmarks, setBookmarks] = useState([]);
    const [newBookmark, setNewBookmark] = useState({ title: "", links: [""] });
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingBookmarkId, setEditingBookmarkId] = useState(null);

    // Fetch bookmarks
    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const { data } = await axios.get("http://localhost:8080/api/bookmarks", {
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

    // Add new link field
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
            const formattedLinks = newBookmark.links.map((link) => ({ url: link }));

            if (isEditing) {
                const { data } = await axios.put(
                    `http://localhost:8080/api/bookmarks/${editingBookmarkId}`,
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
                    "http://localhost:8080/api/bookmarks",
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

    // Delete bookmark
    const deleteBookmark = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/bookmarks/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setBookmarks(bookmarks.filter((bookmark) => bookmark._id !== id));
        } catch (error) {
            console.error("Error deleting bookmark:", error);
        }
    };

    // Open links in new tabs
    const openLinks = (links) => {
        const formattedLinks = links.map((link) =>
            link.url.startsWith("http://") || link.url.startsWith("https://")
                ? link.url
                : `https://${link.url}`
        );

        const linkListHTML = formattedLinks
            .map((url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)
            .join("<br>");

        Swal.fire({
            title: "Browser prevents auto-opening multiple tabs. Hold Ctrl + Click on each link.",
            html: `
                    <div style="text-align: left; font-size: 20px;">
                        ${linkListHTML}
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
            <div className="max-w-[800px] mx-auto  grid grid-rows-1">

                {/* Bookmark Modal */}
                {showForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded p-6 w-[400px] shadow-lg">
                            <h2 className="text-xl font-bold mb-4">
                                {isEditing ? "Edit Bookmark" : "Add Bookmark"}
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
                                className="mb-2 px-4 py-2 bg-green-600 text-white rounded"
                                onClick={addLinkField}
                            >
                                Add Link
                            </button>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                    onClick={saveOrUpdateBookmark}
                                >
                                    Save
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Display Bookmarks */}
                <div className="grid grid-cols-2 sm:grid-cols-5  mx-auto sm:max-w-[600px] gap-4 mt-2 relative">
                    <div className={`my-[26px] left-[-50px] absolute ${bookmarks.length > 0 ? 'w-auto' : 'w-[150px]'}`}>
                        {/* Add Bookmark Button */}
                        <button
                            title="Add Bookmark"
                            className={`flex justify-center mx-auto ${bookmarks.length > 0 ? 'w-auto' : 'w-[150px]'}`}
                            onClick={() => {
                                setNewBookmark({ title: "", links: [""] });
                                setShowForm(true);
                                setIsEditing(false);
                            }}
                        >
                            <img src="/assets/circle-plus-sm.svg" alt="Add Link" className="bg-white w-7 h-7 rounded-full" />
                            {bookmarks.length === 0 && <p className="">Add a bookmark</p>}
                        </button>
                    </div>

                    {bookmarks.map((bookmark) => (
                        <div
                            key={bookmark._id}
                            className="bg-gray-800 text-white max-w-[95px] p-1 rounded relative group hover:scale-115"
                        >
                            {/* Title button */}
                            <button
                                title="Show Links"
                                className="hover:scale-105  text-center w-[80px]"
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
