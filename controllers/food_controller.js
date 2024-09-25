const foodModel = require("../models/food_model.js");
const fs = require("node:fs");

const addFood = async (req, res, next) => {
  if (!req.file || !req.file.filename) {
    return res
      .status(400)
      .json({ success: false, message: "File Image not found" });
  }

  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    return res
      .status(201)
      .json({ success: true, message: "food saved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const listFood = async (req, res, next) => {
  try {
    const foods = await foodModel.find({});
    return res.status(200).json({ success: true, data: foods });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const removeFood = async (req, res, next) => {
  try {
    const food = await foodModel.findById(req.params.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      data: null,
      message: "food removed successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { addFood, listFood, removeFood };
