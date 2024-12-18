const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  addCard,
  getCardById,
  deleteCard,
  updateCard,
} = require("../controllers/cardController.js");


router.post("/", verifyToken, addCard);
router.get("/:id", verifyToken, getCardById);
router.delete("/:id", verifyToken, deleteCard);
router.put("/:id", verifyToken, updateCard);


module.exports = router;
