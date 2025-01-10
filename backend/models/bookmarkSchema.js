const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
   
  },
  links: [
    {
      url: { type: String},
    },
  ],
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);