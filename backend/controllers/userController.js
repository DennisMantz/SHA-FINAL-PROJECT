require("dotenv").config();
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const register = async (req, res) => {
  try {
    let { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).send({ msg: "Please fill all the fields" });
    }
    let oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).send({ msg: "User already exists" });
    }
    let hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS); // had simple -> 10
    let newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });
    return res.send({ msg: "User Created", newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error", error });
  }
};

const logIn = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.send({ msg: "Both email and password are required" });
    }
    let registeredUser = await User.findOne({ email });
    if (!registeredUser) {
      return res.send({ msg: "User not found" });
    }
    let isPasswordValid = await bcrypt.compare(
      password,
      registeredUser.password
    );
    if (!isPasswordValid) {
      return res.send({ msg: "Invalid Password" });
    }

    //token 
    let payload = {userId: registeredUser._id, email: registeredUser.email }; //If I want to render the username without a new call -> username: registeredUser.username, ???
    let secret = process.env.JWT_SECRET;
    let token = await jwt.sign(payload, secret ); // ,{expiresIn:"1h"} --> check refresh token
    return res.send({ msg: "Login Successful", token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error", error });
  }
};

// const getUserById = async (req, res) => {

//     try {
//         let user = await User.findById(req.params.id);
//         return res.send(user);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({msg: "Internal Server Error", error});
//     }
// };

// const updateUserData = async (req, res) => {
//     try {
//         let newValue = req.body;
//         let id = req.params.id;
//         let updatedUser = await User.findByIdAndUpdate(id, newValue, {new: true});
//         return res.send({msg: "User Updated", updatedUser});
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send("Internal Server Error", error);
//     }
// };

// const deleteUser = async (req, res) => {
//     try {

//         let id = req.params.id;
//         let deletedUser = await User.findByIdAndDelete(id,{new: true});
//         return res.send({msg: "User Deleted", deletedUser});
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send("Internal Server Error", error);
//     }
// };
//, getUserById, updateUserData, deleteUser
module.exports = { register, logIn };
