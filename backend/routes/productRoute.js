const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/products/new")
  .post(isAuthenticated, authorizeRoles("retailer"), createProduct);
router
  .route("/products/:id")
  .put(isAuthenticated, authorizeRoles("retailer"), updateProduct)
  .delete(isAuthenticated, authorizeRoles("retailer"), deleteProduct)
  .get(getProductDetails);

module.exports = router;
