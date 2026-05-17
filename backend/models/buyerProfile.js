// ===============================
// models/BuyerProfile.js
// ===============================
const mongoose = require("mongoose");

const buyerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    checksMade: {
      type: Number,
      default: 0
    },

    savedSellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    reportsMade: {
      type: Number,
      default: 0
    },

    recentActivity: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BuyerProfile", buyerProfileSchema);