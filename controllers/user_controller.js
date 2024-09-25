const userModel = require("../models/user_model.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { createToken } = require("../config/createToken.js");

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user);
    req.currentUser = user;
    return res.status(200).json({
      success: true,
      data: {
        token,
        data: { role: user.role, email: user.email },
        message: `${user.email} is login successfully`,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (
    !name ||
    name.trim().length === 0 ||
    !email ||
    email.trim().length === 0 ||
    !password ||
    password.trim() === 0
  ) {
    return res.status(401).json({
      success: false,
      message: "Fields Is Required Email and Name And Password",
    });
  }

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: `User ${email} already registered` });
    }

    if (!validator.isEmail(email)) {
      return res.status(401).json({ success: false, message: `Invalid email` });
    }

    if (password.length < 8) {
      return res
        .status(401)
        .json({ success: false, message: `Enter a strong password` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user);
    req.currentUser = user;
    return res.status(201).json({
      success: true,
      data: { token, role: user.role, message: "user is created successfully" },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { loginUser, registerUser };
