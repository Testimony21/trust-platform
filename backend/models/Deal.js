const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      default: 0,
    },

    platform: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "payment_sent",
        "delivered",
        "completed",
        "cancelled",
        "disputed",
      ],
      default: "pending",
    },

    buyerConfirmed: {
      type: Boolean,
      default: false,
    },

    sellerConfirmed: {
      type: Boolean,
      default: false,
    },

    completedAt: Date,

    deletedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);