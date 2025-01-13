const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  addBookmark,
  getAllBookmarks,
  updateBookmark,
  deleteBookmark,
} = require("../controllers/bookmarkController");

// Add a new bookmark
router.post("/", verifyToken, addBookmark);

// Get all bookmarks for a user
router.get("/", verifyToken, getAllBookmarks);

// Update a bookmark
router.put("/:id", verifyToken, updateBookmark);

// Delete a bookmark
router.delete("/:id", verifyToken, deleteBookmark);

module.exports = router;
