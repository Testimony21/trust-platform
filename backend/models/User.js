const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },  
  role: {
    type: String,
    enum: ["buyer", "seller", "both", "admin"],
    default: "buyer"
  },

  isAdmin: {
    type: Boolean,
    default: false // Strictly false by default
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);