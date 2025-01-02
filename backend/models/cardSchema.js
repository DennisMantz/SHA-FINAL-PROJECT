const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  cardTitle: { type: String, default: "" },
  cardFirstName: {type: String, default:""},
  cardLastName: {type: String,  default:""},
  cardPicture: {type: String, default:"https://res.cloudinary.com/syncbro-finalproject/image/upload/f_auto,q_auto/v1/syncbro_cards/psteckcvif4w9nayyu6i"},  //cloudinary check
  cardAbout: {type: String,  default:""},
  cardEmail: {type: String,  default:""},

  cardSocialLinks: {
    type: [
      {
        title: { type: String },
        link: { type: String },
      },
    ],
    default: [], // Ensures the field is an empty array by default
  },
  cardProjectLinks: {
    type: [
      {
        title: { type: String },
        link: { type: String },
      },
    ],
    default: [], // Ensures the field is an empty array by default
  },
  cardCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cardBackgroundColor: { type: String, default: "#FFFFFF" }, // Default to white
},
{ timestamps: true });
const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
