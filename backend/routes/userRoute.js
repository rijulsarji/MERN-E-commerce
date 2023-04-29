const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  viewUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  changePassword,
  updateUser,
  getAllUsers,
  updateUserAdmin,
  deleteUserAdmin,
} = require("../controllers/userController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

// login/register operations
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

// user profile operations
router.route("/my-profile").get(isAuthenticated, getUserDetails);
router.route("/my-profile/update").put(isAuthenticated, updateUser);

// password modifications
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticated, changePassword);

// admin routes
router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUsers)
router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRoles("admin"), viewUser)
  .put(isAuthenticated, authorizeRoles("admin"), updateUserAdmin)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUserAdmin);


module.exports = router;
