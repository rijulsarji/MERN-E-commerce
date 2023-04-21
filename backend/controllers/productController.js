const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// catchAsyncErrors and ErrorHandler are both error handling features but work for different purposes. catchAsyncErrors is to catch async await errors. ErrorHandler is to catch server errors

// whenever we want to use middlewares, we always use next command

// Create product -- Retailer
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// -- Retailer
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // if set to true, if returns the modified document, otherwise it sends the original document
    runValidators: true, // if set to true, it runs the inputs again with the schema rules
    useFindAndModify: false, // if set to true, it would use the deprecated findAndModify(). if false (recommended method), it would use findOneAndUpdate()
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// --Retailer
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted",
  });
});

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.getAllProducts = catchAsyncErrors(async (req, res) => {

  const resultPerPage = 5;
  const productCount = await Product.countDocuments()

  const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productCount
  });
});
