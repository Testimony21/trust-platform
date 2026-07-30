const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["review"], // extend later: "deal_accepted", "message", etc.
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedDeal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
    },
    relatedReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);