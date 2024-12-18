const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  cardFirstName: {type: String,},
  cardLastName: {type: String,},
  cardPicture: {type: String,},  //cloudinary check
  cardAbout: {type: String,},
  cardEmail: {type: String,},

  // cardSocialTitle: {type: String,},
  cardSocialLinks: {type: String,}, // we need key:value pairs for title linkedin and value link

  // cardProjectTitle: {type: String,},
  cardProjectLinks: {type: String,}, // we need key:value pairs
  cardCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
