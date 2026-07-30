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

    description: {
      type: String,
      trim: true,
      maxlength: 1000
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
        "Pending",
        "Accepted",
        "Active",
        "Completed",
        "Cancelled",
        // "Declined",
        "Disputed",
      ],
      default: "Pending",
    },

    buyerConfirmed: {
      type: Boolean,
      default: false,
    },

    sellerConfirmed: {
      type: Boolean,
      default: false,
    },

    buyerReviewed: {
      type: Boolean,
      default: false
    },

    sellerReviewed: {
      type: Boolean,
      default: false
    },

    acceptedAt: Date,

    completedAt: Date,

    cancelledAt: Date,

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