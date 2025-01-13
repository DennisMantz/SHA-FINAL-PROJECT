const express = require("express");
const router = express.Router();
const { verifyToken, verifyOwnership } = require("../middleware/auth");


const {
  addCard,
  getCardById,
  getAllCards,
  deleteCard,
  updateCard,
  uploadImage,
} = require("../controllers/cardController.js");


router.post("/", verifyToken, addCard);
router.get("/", verifyToken, getAllCards);

router.get("/:id", getCardById); //share that without token
// Protected routes
router.delete("/:id", verifyToken, verifyOwnership, deleteCard);
router.put("/:id", verifyToken, verifyOwnership, updateCard);
router.post("/:id/upload-image", verifyToken, verifyOwnership, uploadImage);

module.exports = router;

