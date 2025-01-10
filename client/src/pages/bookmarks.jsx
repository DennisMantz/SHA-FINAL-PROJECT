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
            title: "Open Links",
            html: `<div style="text-align: left;">${linkListHTML}</div>`,
            icon: "info",
            confirmButtonText: "Close",
            width: 600,
            showCloseButton: true,
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
        <div className="max-w-[800px] mx-auto flex relative">
            {/* Add Bookmark Button */}
            <button
                className="w-[50px] h-[30px] mx-auto mt-4 bg-gray-800 text-white rounded absolute "
                onClick={() => {
                    setNewBookmark({ title: "", links: [""] });
                    setShowForm(true);
                    setIsEditing(false);
                }}
            >
                Add
            </button>

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
            <div className="grid grid-cols-5 mx-auto max-w-[600px] gap-3">
    {bookmarks.map((bookmark) => (
        <div
            key={bookmark._id}
            className="bg-gray-800 text-white w-[100px] h-[100px] p-2 rounded relative group"
        >
            {/* Title button */}
            <button
                className="hover:scale-105 w-full text-left"
                onClick={() => openLinks(bookmark.links)}
            >
                {bookmark.title}
            </button>

            {/* Edit and Delete buttons (shown on hover, positioned outside) */}
            <div className="hidden group-hover:flex flex-col absolute top-0 left-[-60px] space-y-2">
                <button
                    className="p-1 bg-yellow-500 text-black rounded hover:scale-105"
                    onClick={() => openEditForm(bookmark)}
                >
                    Edit
                </button>
                <button
                    className="p-1 bg-red-600 text-white rounded hover:scale-105"
                    onClick={() => deleteBookmark(bookmark._id)}
                >
                    Delete
                </button>
            </div>
        </div>
    ))}
</div>

        </div>
    );
}

export default BookmarkManager;
