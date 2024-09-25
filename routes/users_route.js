const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const {
  showUsers,
  updateUsers,
  deleteUser,
  addUser,
} = require("../controllers/users_admin_controller.js");
const allowRole = require("../middleware/allowRole.js");
const userRoles = require("../constant/Roles.js");

const usersRouter = express.Router();

usersRouter.get(
  `/subscribers`,
  allowRole(userRoles.ADMIN, userRoles.MANAGER),
  authMiddleware,
  showUsers
);

usersRouter.patch(
  `/updateUser`,
  allowRole(userRoles.MANAGER),
  authMiddleware,
  updateUsers
);

usersRouter.delete(
  `/deleteUser/:id`,
  allowRole(userRoles.MANAGER),
  authMiddleware,
  deleteUser
);

usersRouter.post(
  `/createUser`,
  allowRole(userRoles.MANAGER),
  authMiddleware,
  addUser
);

module.exports = usersRouter;
