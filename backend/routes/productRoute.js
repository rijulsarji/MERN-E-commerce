const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/retailer/products/new")
  .post(isAuthenticated, authorizeRoles("retailer"), createProduct);
router
  .route("/retailer/products/:id")
  .put(isAuthenticated, authorizeRoles("retailer"), updateProduct)
  .delete(isAuthenticated, authorizeRoles("retailer"), deleteProduct);

router.route("/products/:id").get(getProductDetails);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticated, deleteReview);
router.route("/review").put(isAuthenticated, createProductReview);  // create review

module.exports = router;
