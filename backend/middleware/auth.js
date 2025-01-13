const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Card = require("../models/cardSchema");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized, Token not found" });
  }

  const token = authHeader.split(" ")[1];
  const secretKey = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized, User not found" });
    }
    next();
  } catch (error) {
    console.error(`JWT Error: ${error.name} - ${error.message}`);
    return res.status(401).json({ message: "Unauthorized, Token is invalid or expired" });
  }
};


// Middleware to verify card ownership
const verifyOwnership = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    if (card.cardCreator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access denied. You do not own this card." });
    }

    req.card = card; // Attach the card to the request object for further use
    next();
  } catch (error) {
    console.error("Error verifying ownership:", error.message);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
};

module.exports = { verifyToken, verifyOwnership };