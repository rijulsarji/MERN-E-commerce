const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  viewUser,
} = require("../controllers/userController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/:id").get(isAuthenticated, authorizeRoles("admin"), viewUser);

module.exports = router;
