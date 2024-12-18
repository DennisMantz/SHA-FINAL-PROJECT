const express = require('express');
const router = express.Router();



const {
    register,
    logIn,
    // getUserById,
    // updateUserData,
    // deleteUser,
  } = require("../controllers/userController.js");
//   const verifyToken = require("../middleware/auth.js");



//Crud operation - different routes
// router.get("/:id", getUserById); 
// router.put("/:id", updateUserData); 
// router.delete("/:id", deleteUser); 

// public routes
router.post("/login", logIn);
router.post("/register", register); 

  
  module.exports = router;