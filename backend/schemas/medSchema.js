const mongoose = require("mongoose");

// Define the schema with properties like 'todo' and 'content'
const examSchema = new mongoose.Schema(
  {
    tittle: { type: String },
    category: { type: String },
    amount: { type: Number },
    date:{ type: Date },
    reDo: { type: Date},
    imageUrl: { type: String, required: true }, // For Cloudinary -> image URL
    //  imageId: { type: String }, // Optional -> managing Cloudinary operations
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
);

// Create a model named 'Todo' using the defined schema
const Exam = mongoose.model("Exam", examSchema);

// Export the 'Todo' model for use in your server.js file
module.exports = Exam;