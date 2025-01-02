const Card = require("../models/cardSchema");
const { cloudinary, transformCircleImage } = require("../index");

// Create a new card (empty or with data)
const addCard = async (req, res) => {
  try {
    const cardData = {
      ...req.body, // Allow data from the request body
      cardCreator: req.user._id, // Attach authenticated user as the creator
    };

    const newCard = await Card.create(cardData);

    res.status(201).json({
      msg: "Card created successfully",
      card: newCard,
    });
  } catch (error) {
    console.error("Error creating card:", error.message);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

let getCardById = async (req, res) => {
    try {
      const card = await Card.findById(req.params.id);
      if (!card) {
        return res.status(404).send({ msg: "Card not found" });
      }
      res.status(200).json(card);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: "Error fetching card by ID", error });
    }
  };

  // Fetch all cards for the authenticated user
const getAllCards = async (req, res) => {
  try {
    const userId = req.user._id; // Authenticated user ID
    const cards = await Card.find({ cardCreator: userId });

    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error.message);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};
  
  
  // Update a card by ID
const updateCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated card
    });

    if (!updatedCard) {
      return res.status(404).json({ msg: "Card not found" });
    }

    res.status(200).json({
      msg: "Card updated successfully",
      card: updatedCard,
    });
  } catch (error) {
    console.error("Error updating card:", error.message);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};
// Delete a card by ID
const deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);

    if (!deletedCard) {
      return res.status(404).json({ msg: "Card not found" });
    }

    res.status(200).json({
      msg: "Card deleted successfully",
      card: deletedCard,
    });
  } catch (error) {
    console.error("Error deleting card:", error.message);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const uploadImage = async (req, res) => {
  try {
    const file = req.file || req.body.image; // Handle FormData or Base64
    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: "syncbro_cards",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    // Get the transformed circular image URL
    const transformedUrl = transformCircleImage(result.public_id);

     // Update card in MongoDB with Cloudinary URL
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      { cardPicture: transformedUrl },
      { new: true }
    );

    res.status(200).json({
      msg: "Image uploaded successfully",
      card: updatedCard,
    });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
};


module.exports = {
  addCard,
  getCardById,
  getAllCards,
  updateCard,
  deleteCard,
  uploadImage,
};