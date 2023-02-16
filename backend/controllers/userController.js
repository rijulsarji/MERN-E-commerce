const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

// Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: "This is public id", url: "This is url" },
    role,
  }); // since we fetched the details above indiviually, we are sending the data this way.

  sendToken(user, 201, res);
});

// Login a user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const {email, password} = req.body;

  // checking if email and password is provided.
  if(!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 404))
  }

  const user = await User.findOne({ email }).select("+password");

  if(!user) {
    return next(new ErrorHandler("Invalid email or password"), 401)
  }

  const isPasswordMatched = user.comparePassword(password);

  // TODO: solve this bug
  console.log(`hm${isPasswordMatched}`)
  if(isPasswordMatched === false) {
    return next(new ErrorHandler("Invalid email or password"), 401)
  }

  sendToken(user, 200, res);
});

// logout user
exports.logoutUser = catchAsyncErrors(async(req, res, next) => {

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })
  
  res.status(200).json({
    success: true,
    message: "Logged Out"
  })
})

// view user
exports.viewUser = catchAsyncErrors( async(req, res, next) => {
  const user = await User.findById(req.params.id)

  if(!user) {
    return next(new ErrorHandler("User doesn't exist", 404))
  }

  res.status(200).json({
    success: true,
    user
  })
})