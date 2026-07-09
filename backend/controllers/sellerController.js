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

// SEARCH SELLER
exports.searchSeller = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchTerm = query.trim();

    // Search users with role "seller" by name, email, or phone
    const matchedUsers = await User.find({
      role: "seller",
      $or: [
        { fullName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ],
    }).select("-password");

    if (matchedUsers.length === 0) {
      return res.status(404).json({ message: "No seller found matching that information" });
    }

    // Attach seller profile data for each match
    const results = await Promise.all(
      matchedUsers.map(async (user) => {
        const profile = await SellerProfile.findOne({ userId: user._id });
        return {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          trustScore: profile?.trustScore ?? 0,
          isVerified: profile?.isVerified ?? false,
          totalDeals: profile?.totalDeals ?? 0,
          successfulDeals: profile?.successfulDeals ?? 0,
          displayName: profile?.displayName ?? user.fullName,
        };
      })
    );

    res.json({ results });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};