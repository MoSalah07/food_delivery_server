const userModel = require("../models/user_model.js");
const bcrypt = require("bcrypt");

const showUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find({}, { password: false });
    return res.status(200).json({
      success: true,
      data: { users: allUsers, message: "users is show successfully" },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateUsers = async (req, res) => {
  try {
    const { id: userId, email: newEmail, role, name } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "id is required" });
    }

    // Check If Change Email From Frontend Or No => Avoid Error in db server side backend
    if (newEmail === null) {
      // Find the user and update the email
      const user = await userModel.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      // Update the email
      user.name = name;
      user.role = role;
      await user.save();
      return res.status(200).json({
        success: true,
        message: `account ${user.email} ${user.name} ${user.role} is update successfully`,
        user,
      });
    } else {
      // Check if the email already exists
      const emailExists = await userModel.findOne({ email: newEmail });
      if (emailExists) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }

      // Find the user and update the email
      const user = await userModel.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Update the email
      user.email = newEmail;
      user.name = name;
      user.role = role;
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "users is update successfully", user });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await userModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if the user with the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (password.length < 8) {
      return res
        .status(401)
        .json({ success: false, message: `Enter a strong password` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await userModel.create({
      name,
      email,
      role: role || "USER",
      password: hashedPassword,
    });

    // Send success response
    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { showUsers, updateUsers, deleteUser, addUser };
