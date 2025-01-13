require("dotenv").config();
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const validator = require("validator");

const register = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    //input validation
    if (!username || !email || !password) {
      return res.status(400).send({ msg: "Please fill all the fields" }); // Status 400: Bad Request
    }

      // Validate email format
      if (!validator.isEmail(email)) {
        return res.status(400).send({ msg: "Invalid email format" });
      }
  
      // Validate password strength (e.g., minimum 8 characters)
      if (!validator.isStrongPassword(password, { minLength: 8 })) {
        return res.status(400).send({
          msg: "Password must be at least 8 characters and include a mix of letters, numbers, and symbols.",
        });
      }
    //check existing user
    let oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send({ msg: "A user with this email already exists" }); // Status 409: Conflict
    }
    // Hash password
    let hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS); // had simple -> 10
    let newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

  // Generate a token
  const payload = { userId: newUser._id, email: newUser.email };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret);

     // Return success response with token
     return res.status(201).send({
      msg: "User created successfully",
      token, // Include the token in the response
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error", error }); // Status 500: Server Error
  }
};

const logIn = async (req, res) => {
  try {
    let { email, password } = req.body;
//input validation
    if (!email || !password) {
      return res.status(400).send({ msg: "Both email and password are required" }); // Status 400: Bad Request
    }
    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).send({ msg: "Invalid email format" });
    }

    //user exists?
    let registeredUser = await User.findOne({ email });
    if (!registeredUser) {
      return res.status(404).send({ msg: "User not found" }); // Status 404: Not Found
    }

    // Validate password
    let isPasswordValid = await bcrypt.compare(
      password,
      registeredUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).send({ msg: "Invalid Password" }); // Status 401: Unauthorized
    }

    //gen token 
    let payload = {userId: registeredUser._id, email: registeredUser.email }; //If I want to render the username without a new call -> username: registeredUser.username, ???
    let secret = process.env.JWT_SECRET;

    // If I include token expiration, read about token refresh
    let token = await jwt.sign(payload, secret ); // ,{expiresIn:"1h"} --> check refresh token
    return res.status(200).send({ msg: "Login Successful", token }); // Status 200: OK
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error", error }); // Status 500: Server Error
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
