const Card = require("../models/cardSchema");

let addCard = async (req, res) => {
  try {
    const createCard = await Card.create({
      ...req.body,
      cardCreator: req.user._id, //req.body.cardCreator
    });

    console.log({ msg: "card created", createCard });

    return res.send({ msg: "Card Created", createCard });
  } catch (error) {
    console.error("Error creating card:", error);
    return res.status(500).send({ msg: "Internal Server Error", error });
  }
};

let getCardById = async (req, res) => {
    try {
      const card = await Card.findById(req.params.id);
      if (!card) {
        return res.status(404).send({ msg: "Card not found" });
      }
      return res.send(card);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: "Internal Server Error", error });
    }
  };
  
  let deleteCard = async (req, res) => {
    try {
      const card = await Card.findByIdAndDelete(req.params.id);
      if (!card) {
        return res.status(404).send({ msg: "Card not found" });
      }
      return res.send({ msg: "Card Deleted", card });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: "Internal Server Error", error });
    }
  };
  
  let updateCard = async (req, res) => {
    try {
      const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!card) {
        return res.status(404).send({ msg: "Card not found" });
      }
      return res.send({ msg: "Card Updated", card });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: "Internal Server Error", error });
    }
  };

module.exports = { addCard, getCardById, deleteCard, updateCard };
