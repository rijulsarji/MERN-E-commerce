const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [3, "Name should have atleast 3 characters"],
  },

  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },

  password: {
    type: String,
    required: [true, "Please enter password"],
    minLength: [8, "Password should be atleast 8 characters"],
    select: false, // since it's a password, we don't want it to be seen in the mongodb database.
  },

  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },

  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String, // since only string parameter is there, we can write it in this shorthand manner
  resetPasswordExpire: Date,
});

UserSchema.pre("save", async function (next) {
  // if during updating profile the user doesn't change the password, the hashed password will hash itself again, which would mess up the password. so that's why we put the below if condition.
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcryptjs.hash(this.password, 10); // 10 refers to the strength of encryption
});

// JWT TOKEN
// we'll generate token and store it in cache

UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  // generating token for reset password
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and adding to user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
  // const tokenCrypto = crypto.createHash("sha256").update(token).digest("hex")
};

module.exports = mongoose.model("User", UserSchema);
