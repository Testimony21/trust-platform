const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
  transactionId: mongoose.Schema.Types.ObjectId,
  reportedBy: mongoose.Schema.Types.ObjectId,

  type: String,
  status: { type: String, default: "open" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Dispute", disputeSchema);