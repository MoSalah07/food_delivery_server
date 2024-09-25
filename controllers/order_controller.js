const orderModel = require("../models/orders_model.js");
const userModel = require("../models/user_model.js");
const Stripe = require("stripe");

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_);
const stripe = new Stripe(process.env.PAYMENTMETHOD_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const { userId, items, amount, address } = req.body;

  const frontEnd_url = "http://localhost:5173" || "http://localhost:5174";

  try {
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontEnd_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontEnd_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    return res.status(201).json({
      success: true,
      data: {
        session_url: session.url,
        message: "Your order has been created successfully",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.status(200).json({
        success: true,
        message: "payment has been updated successfully",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.status(200).json({ success: false, message: "Not Paid" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const userOrders = async (req, res) => {
  const { userId } = req.body;

  if (!userId)
    return res
      .status(400)
      .json({ success: false, message: "userId is required" });

  try {
    const orders = await orderModel.find({ userId });
    if (!orders)
      return res
        .status(404)
        .json({ success: false, message: `orders not found` });

    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Listing orders for admin panel

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// api for updating order status

const updateStatus = async (req, res) => {
  const { status, orderId } = req.body;

  if (!status) {
    return res
      .status(401)
      .json({ success: false, message: "status is required" });
  }

  if (!orderId) {
    return res
      .status(401)
      .json({ success: false, message: "orderId is required" });
  }

  try {
    await orderModel.findByIdAndUpdate(orderId, { status });
    return res
      .status(200)
      .json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.log(err);
    return res.stauts(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
};
