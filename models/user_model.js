const mongoose = require("mongoose");
const userRoles = require("../constant/Roles.js");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    role: {
      type: String,
      enum: [userRoles.MANAGER, userRoles.ADMIN, userRoles.USER],
      default: userRoles.USER,
    },
  },
  { minimize: false, timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
module.exports = userModel;
