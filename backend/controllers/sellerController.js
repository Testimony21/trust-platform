const SellerProfile = require("../models/SellerProfile");
const User = require("../models/User")

// CREATE SELLER PROFILE
exports.createSellerProfile = async (req, res) => {
  try {
    const { displayName, bio, phone } = req.body;

    const existing = await SellerProfile.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "Seller profile already exists" });
    }

    const seller = await SellerProfile.create({
      userId: req.user._id,
      displayName,
      bio,
      phone
    });

    res.status(201).json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SELLER PROFILE
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await SellerProfile.findOne({ userId: req.params.userId });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};