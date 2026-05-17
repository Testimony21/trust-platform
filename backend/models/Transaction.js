const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  buyerId: mongoose.Schema.Types.ObjectId,
  sellerId: mongoose.Schema.Types.ObjectId,

  status: {
    type: String,
    enum: ["pending", "completed", "disputed", "failed"],
    default: "pending"
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);