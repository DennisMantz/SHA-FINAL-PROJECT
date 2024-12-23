const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  cardFirstName: {type: String,},
  cardLastName: {type: String,},
  cardPicture: {type: String,},  //cloudinary check
  cardAbout: {type: String,},
  cardEmail: {type: String,},

  cardSocialLinks: [
    {
      title: { type: String, required: true }, //  "LinkedIn"
      link: { type: String, required: true },  //  "https://linkedin.com/in/user"
    },
  ],

  cardProjectLinks: [
    {
      title: { type: String, required: true }, // "GitHub" "Netlify" "Portfolio"
      link: { type: String, required: true },  // "https://portfolio.com"
    },
  ],
  cardCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cardBackgroundColor: { type: String, default: "#FFFFFF" }, // Default to white
});
const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
