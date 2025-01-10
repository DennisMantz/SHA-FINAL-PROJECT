const Bookmark = require("../models/bookmarkSchema");

// Add a new bookmark
const addBookmark = async (req, res) => {
  const { title, links } = req.body;

  if (links.length > 10) {
    return res.status(400).json({ error: "Cannot add more than 10 links." });
  }

  try {
    const newBookmark = await Bookmark.create({
      userId: req.user._id,
      title,
      links,
    });

    res.status(201).json(newBookmark);
  } catch (error) {
    console.error("Error adding bookmark:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get all bookmarks for the authenticated user
const getAllBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id });
    res.status(200).json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Update a bookmark
const updateBookmark = async (req, res) => {
  const { title, links } = req.body;

  if (links.length > 10) {
    return res.status(400).json({ error: "Cannot add more than 10 links." });
  }

  try {
    const updatedBookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, links },
      { new: true }
    );

    if (!updatedBookmark) {
      return res.status(404).json({ error: "Bookmark not found." });
    }

    res.status(200).json(updatedBookmark);
  } catch (error) {
    console.error("Error updating bookmark:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Delete a bookmark
const deleteBookmark = async (req, res) => {
  try {
    const deletedBookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deletedBookmark) {
      return res.status(404).json({ error: "Bookmark not found." });
    }

    res.status(200).json({ message: "Bookmark deleted successfully." });
  } catch (error) {
    console.error("Error deleting bookmark:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  addBookmark,
  getAllBookmarks,
  updateBookmark,
  deleteBookmark,
};
