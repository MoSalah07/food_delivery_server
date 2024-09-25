const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");
// Routes
const foodRouter = require("./routes/food_route");
const userRouter = require("./routes/user_route");
const cartRouter = require("./routes/cart_route");
const orderRouter = require("./routes/order_route");
const usersRouter = require("./routes/users_route");
// Utlis
const { ERROR } = require("./types/error.types");

// app config
const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// DB
connectDB();

// API End Points
app.use("/api/food", foodRouter);
app.use("/api/images", express.static("uploads"));
app.use("/api/auth", userRouter);
app.use(`/api/cart`, cartRouter);
app.use(`/api/order`, orderRouter);
app.use(`/api/users`, usersRouter);

// Global middleware for not found router
app.all("*", (req, res) => {
  res
    .status(404)
    .json({ status: ERROR, message: "this resource is not available" });
});

// Global middleware for Errors
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    status: error.statusText || ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
