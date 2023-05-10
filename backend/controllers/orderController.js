const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    createdBy,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    createdBy,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  // what populate does is, it will take the user id from order database, go to the user database and take "name" & "email", and would replace them with "user" when displaying

  if (!order)
    return next(new ErrorHandler("Order not found with this id", 404));

  res.status(200).json({
    success: true,
    order,
  });
});

// get profile related orders only
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all orders related to the particular retailer only
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ createdBy: req.user._id }).populate(
    "user",
    "name email"
  );

  if (!orders)
    return next(new ErrorHandler("No Orders found by this retailer"), 404);

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler("Product doesn't exist"));

  if (order.createdBy !== req.user.id) {
    console.log(req.user.id)
    console.log(order.createdBy)
    return next(
      new ErrorHandler("No object with this id found with this retailer")
    );
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have delivered the product", 400));
  }

  order.orderItems.forEach(async (tempOrd) => {
    await updateStock(tempOrd.product, tempOrd.quantity);
  });

  order.orderStatus = req.body.status;

  await order.save({ validateBeforeSave: false });

  if (req.body.status === "Delivered") order.deliveredAt = Date.now();

  res.status(200).json({
    success: true
  })
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler("Product doesn't exist"));

  if (order.createdBy !== req.user.id)
    return next(
      new ErrorHandler("No object with this id found with this retailer")
    );

  if (!order) return next(new ErrorHandler("Product doesn't exist"));

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
