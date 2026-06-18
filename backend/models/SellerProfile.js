const mongoose = require("mongoose");

const sellerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  displayName: {
    type: String,
    required: true
  },

  bio: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    default: ""
  },

  socialLinks: {
    instagram: String,
    twitter: String,
    facebook: String
  },

  trustScore: {
    type: Number,
    default: 0
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  totalDeals: {
    type: Number,
    default: 0
  },

  successfulDeals: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("SellerProfile", sellerProfileSchema);