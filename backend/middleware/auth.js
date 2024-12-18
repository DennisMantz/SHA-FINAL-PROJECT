const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

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

module.exports = verifyToken;