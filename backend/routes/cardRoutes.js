const express = require("express");
const router = express.Router();

const {
  addBusinessCard,
  getBusinessCardById,
  deleteBusinessCard,
  updateBusinessCard,
} = require("../controllers/cardController.js");


router.post("/card", addBusinessCard);
router.get("/card/:id", getBusinessCardById);
router.delete("/card/:id", deleteBusinessCard);
router.put("/card/:id", updateBusinessCard);


module.exports = router;
