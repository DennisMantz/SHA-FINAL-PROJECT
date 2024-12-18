const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  cardFirstName: {String},
  cardLastName: {String},
  cardPicture: {String},  //cloudinary check
  cardAbout: {String},
  cardEmail: {String},

  cardSocialTitle: {String},
  cardSocialLinks: {String},

  cardProjectTitle: {String},
  cardProjectLinks: {String},
  cardCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
