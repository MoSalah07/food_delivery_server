const express = require("express");
const {
  addToCart,
  removeToCart,
  getCart,
} = require("../controllers/cart_controller.js");
const authMiddleware = require("../middleware/auth.js");

const cartRouter = express.Router();

cartRouter.post(`/add`, authMiddleware, addToCart);
cartRouter.post(`/remove`, authMiddleware, removeToCart);
cartRouter.post(`/get`, authMiddleware, getCart);

module.exports = cartRouter;
