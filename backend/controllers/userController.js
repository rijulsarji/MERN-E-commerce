const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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
  const { email, password } = req.body;

  // checking if email and password is provided.
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 404));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password"), 401);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password"), 401);
  }

  sendToken(user, 200, res);
});

// logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new ErrorHandler("User not found", 404));

  // get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // to make the url dynamic, req.get("host") will provide you the hostname
  // we won't know what the protocol would be, http or https. so we put it as req.protocol
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this url, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(err.message, 500));
  }
});

// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // first we click the forgot password option which will send a link to the mail of the user. now when we click the mail we need it to change the password to our choice. we can access the token from the email link by using req.params.token

  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new ErrorHandler("Reset password token is invalid or has expired", 400)
    );

  if (req.body.password !== req.body.confirmPassword)
    return next(new ErrorHandler("Password don't match", 400));

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // if(!user)
  //   return next(new ErrorHandler("User not found", 400))

  // this error handling is not required here since we would be debugging it in routes itself in such a way that only the person logged in would be able to open it.

  res.status(200).json({
    success: true,
    user,
  });
});

// update user password
exports.changePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched)
    return next(new ErrorHandler("Old password is incorrect", 400));

  if (req.body.newPassword !== req.body.newConfirmPassword)
    return next(new ErrorHandler("Passwords do not match", 400));

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

exports.updateUser = catchAsyncErrors(async(req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    // TODO: add cloudinary for avatar
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true
  })
})

// get all users -- ADMIN ACCESS
exports.getAllUsers = catchAsyncErrors(async(req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    success: true,
    users
  })
})

// view user -- ADMIN ACCESS
exports.viewUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update profile -- ADMIN ACCESS
exports.updateUserAdmin = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// delete profile -- ADMIN ACCESS
exports.deleteUserAdmin = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findByIdAndDelete(req.params.id)
  // TODO: we will remove cloudinary later

  if(!user)
    return next(new ErrorHandler("User not found", 400))

  res.status(200).json({
    success: true,
  });
});
