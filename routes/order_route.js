const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
} = require("../controllers/order_controller.js");

const orderRouter = express.Router();

orderRouter.post(`/place`, authMiddleware, placeOrder);
orderRouter.post(`/verify`, verifyOrder);
orderRouter.post(`/userorders`, authMiddleware, userOrders);
orderRouter.get(`/list`, listOrders);
orderRouter.post(`/status`, updateStatus);

module.exports = orderRouter;
