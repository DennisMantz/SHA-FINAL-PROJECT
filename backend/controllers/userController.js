const User = require("../models/userSchema");

const addNewUser = async (req, res) => {
    try {
        let user = await User.create(req.body);
        return res.send({msg: "user created", user});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error", error);
        
    }
};

const logIn = async (req, res) => {
    res.send("LogIn Route");
};

const getUserById = async (req, res) => {

    try {
        let user = await User.findById(req.params.id);
        return res.send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error", error);
    }
};

const updateUserData = async (req, res) => {
    res.send("Update User Data Route");
};

const deleteUser = async (req, res) => {
    res.send("Delete User Route");
};

module.exports = { addNewUser, logIn, getUserById, updateUserData, deleteUser };