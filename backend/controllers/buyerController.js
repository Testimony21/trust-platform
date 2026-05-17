// ===============================
// controllers/buyerController.js
// ===============================
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

    if (!query) {
      return res.status(400).json({
        message: "Search query required"
      });
    }

    const seller = await SellerProfile.findOne({
      $or: [
        { email: query },
        { username: query },
        { phone: query }
      ]
    });

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found"
      });
    }

    const profile = await BuyerProfile.findOne({
      userId: req.user.id
    });

    if (profile) {
      profile.checksMade += 1;

      profile.recentActivity.unshift(
        `Checked ${seller.username || seller.email}`
      );

      await profile.save();
    }

    res.json({
      seller: {
        _id: seller._id,
        username: seller.username,
        email: seller.email,
        phone: seller.phone,
        trustScore: seller.trustScore,
        isVerified: seller.isVerified,
        reports: seller.reports
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