// ===============================
// controllers/buyerController.js
// ===============================

const User = require("../models/User");
const BuyerProfile = require("../models/BuyerProfile");
const SellerProfile = require("../models/SellerProfile");

// GET BUYER DASHBOARD
exports.getBuyerDashboard = async (req, res) => {
  try {
    const profile = await BuyerProfile.findOne({
      userId: req.user.id
    });

    if (!profile) {
      return res.status(404).json({
        message: "Buyer profile not found"
      });
    }

    res.json({
      checksMade: profile.checksMade,
      savedSellers: profile.savedSellers.length,
      reportsMade: profile.reportsMade,
      recentActivity: profile.recentActivity
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// INCREASE CHECKS WHEN SEARCHING SELLER
exports.addCheck = async (req, res) => {
  try {
    const profile = await BuyerProfile.findOne({
      userId: req.user.id
    });

    profile.checksMade += 1;

    profile.recentActivity.unshift(
      "You verified a seller"
    );

    await profile.save();

    res.json({
      message: "Check added"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.verifySeller = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Search query required" });
    }

    const searchTerm = query.trim();
    const words = searchTerm.split(/\s+/).filter(Boolean);

    // Require ALL words to appear in fullName (AND, not OR)
    const nameMatch = {
      $and: words.map((word) => ({
        fullName: { $regex: word, $options: "i" }
      }))
    };

    const matchedUser = await User.findOne({
      role: "seller",
      $or: [
        nameMatch,
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ],
    });

    if (!matchedUser) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const sellerProfile = await SellerProfile.findOne({ userId: matchedUser._id });
    const profile = await BuyerProfile.findOne({ userId: req.user.id });

    if (profile) {
      profile.checksMade += 1;
      profile.recentActivity.unshift(`Checked ${matchedUser.fullName || matchedUser.email}`);
      await profile.save();
    }

    res.json({
      seller: {
        _id: matchedUser._id,
        fullName: matchedUser.fullName,
        email: matchedUser.email,
        phone: matchedUser.phone,
        trustScore: sellerProfile?.trustScore ?? 0,
        isVerified: sellerProfile?.isVerified ?? false,
        reports: sellerProfile?.reports ?? 0,
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SAVE SELLER
exports.saveSeller = async (req, res) => {
  try {
    const { sellerId } = req.body;

    const profile = await BuyerProfile.findOne({
      userId: req.user.id
    });

    if (!profile.savedSellers.includes(sellerId)) {
      profile.savedSellers.push(sellerId);

      profile.recentActivity.unshift(
        "You saved a trusted seller"
      );

      await profile.save();
    }

    res.json({
      message: "Seller saved"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// REPORT SELLER
exports.reportSeller = async (req, res) => {
  try {
    const { sellerId } = req.body;

    const profile = await BuyerProfile.findOne({
      userId: req.user.id
    });

    const seller = await SellerProfile.findById(sellerId);

    seller.reports += 1;

    profile.reportsMade += 1;

    profile.recentActivity.unshift(
      "You reported a suspicious seller"
    );

    await seller.save();
    await profile.save();

    res.json({
      message: "Seller reported"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};