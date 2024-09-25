const userModel = require("../models/user_model.js");

const addToCart = async (req, res) => {
  try {
    if (!req.body.itemId) {
      return res
        .status(401)
        .json({ success: false, message: "itemId is required" });
    }
    let userData = await userModel.findOne({ _id: req.body.userId });
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    return res
      .status(200)
      .json({ success: true, message: "Cart added successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const removeToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "user id not found" });
    }
    let cartData = userData.cartData;

    if (!req.body.itemId) {
      return res
        .status(401)
        .json({ success: false, message: "itemId is required" });
    }

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    return res
      .status(200)
      .json({ success: true, message: "Remove From Cart Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    return res.status(200).json({ success: true, data: cartData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addToCart, removeToCart, getCart };
