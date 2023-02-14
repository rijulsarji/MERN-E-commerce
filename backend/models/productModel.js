const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Please enter product description"]
  },
  price: {
    type: Number,
    required: [true, "Please enter product number"],
    maxLength: [8, "Price cannot exceed 8 figures"]
  },
  ratings: {
    type: Number,
    default: 0
  },

  // since there are gonna be multiple images, we'll take images as array
  images: [
    {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
    }}
  ],
  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [3, "Stock cannot exceed 4 characters"],
    default: 1
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true
      },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Product", ProductSchema);