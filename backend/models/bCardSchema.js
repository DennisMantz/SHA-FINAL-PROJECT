const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  profileFirstName: {String},
  profileLastName: {String},
  profilePicture: {String},
  profileAbout: {},
  profileLinks: {},

  projectLinks: {},

  profileCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
