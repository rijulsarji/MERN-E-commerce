const express = require("express");
const {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

router.route("/order/new").post(isAuthenticated, createOrder);
router
  .route("/order/:id")
  .get(isAuthenticated, authorizeRoles("retailer"), getSingleOrder);
router.route("/orders/me").get(isAuthenticated, myOrders);
router
  .route("/retailer/orders/all")
  .get(isAuthenticated, authorizeRoles("retailer"), getAllOrders);

router
  .route("/retailer/order/:id")
  .put(isAuthenticated, authorizeRoles("retailer"), updateOrder)
  .delete(isAuthenticated, authorizeRoles("retailer"), deleteOrder);

module.exports = router;
