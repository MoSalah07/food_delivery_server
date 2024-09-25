const express = require("express");
const {
  addFood,
  listFood,
  removeFood,
} = require("../controllers/food_controller.js");
const multer = require("multer");
const { globalError } = require("../config/appError.js");
const { ERROR } = require("../types/error.types.js");
const allowRole = require("../middleware/allowRole.js");
const userRoles = require("../constant/Roles.js");

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const { name, description } = req.body;
    if (
      !name ||
      name.trim().length === 0 ||
      !description ||
      description.trim().length === 0
    ) {
      return cb(
        globalError().createError(
          `Product Name or description not valid, Can't Add Image`,
          500,
          ERROR
        ),
        false
      );
    }
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage });

foodRouter.post(
  "/add",
  allowRole(userRoles.ADMIN, userRoles.MANAGER),
  upload.single("image"),
  addFood
);
foodRouter.get("/list", listFood);
foodRouter.delete(
  "/remove/:id",
  allowRole(userRoles.ADMIN, userRoles.MANAGER),
  removeFood
);

module.exports = foodRouter;
