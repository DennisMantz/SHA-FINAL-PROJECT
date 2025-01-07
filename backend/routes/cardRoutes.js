const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");


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
router.delete("/:id", verifyToken, deleteCard);
router.put("/:id", verifyToken, updateCard);
router.post("/:id/upload-image", verifyToken, uploadImage);

module.exports = router;

