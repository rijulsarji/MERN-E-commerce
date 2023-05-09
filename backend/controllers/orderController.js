const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

exports.createOrder = catchAsyncErrors(async(req, res, next) => {
  const {shippingInfo, orderItems, paymentInfo, itemsPrice}
})