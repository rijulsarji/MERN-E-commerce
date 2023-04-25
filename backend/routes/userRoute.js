const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  viewUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
} = require("../controllers/userController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
router.route("/view-user/:id").get(isAuthenticated, authorizeRoles("admin"), viewUser);
router.route("/my-profile").get(isAuthenticated, getUserDetails)

module.exports = router;
