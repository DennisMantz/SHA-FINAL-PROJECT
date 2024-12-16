const express = require('express');
const router = express.Router();



const {
    addNewUser,
    logIn,
    getUserById,
    updateUserData,
    deleteUser,
  } = require("../controllers/userController.js");
//   const verifyToken = require("../middleware/auth.js");
//   const {upload}  = require("../controllers/uploadController.js");


//Crud operation - different routes
router.get("/:id", getUserById); 
router.put("/:id", updateUserData); 
router.delete("/:id", deleteUser); 



// public routes
router.post("/login", logIn);
router.post("/register", addNewUser); 


// Upload route to handle the file upload
// router.post('/upload', (req, res) => {
//     upload(req, res, (err) => {
//       if (err) {
//         return res.status(400).send(err);  // Send error if any
//       }
//       res.status(200).send({ message: 'File uploaded successfully!', file: req.file });  // Send response with uploaded file data
//     });
//   });
  
  module.exports = router;