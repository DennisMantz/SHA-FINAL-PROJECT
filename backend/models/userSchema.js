const mongoose = require("mongoose");

//Remember to recheck mongoose schema types / schemas and validation
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true // Converts email to lowercase aytomatically
    },
    password: {
      type: String,
      required: true
    },
  }
  // ,
  // {
  //   timestamps: true, // This option automatically adds 'createdAt' and 'updatedAt' fields to your documents
  // }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
