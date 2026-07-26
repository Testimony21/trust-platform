const SellerProfile = require("../models/SellerProfile");
const User = require("../models/User");

// CREATE SELLER PROFILE
exports.createSellerProfile = async (req, res) => {
  try {
    const { displayName, bio, phone } = req.body;
    
    // Safety check on property assignment mapping context
    const userId = req.user.id || req.user._id;

    const existing = await SellerProfile.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "Seller profile already exists" });
    }

    const seller = await SellerProfile.create({
      userId,
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

// SEARCH SELLER - OPTIMIZED VIA AGGREGATION & REGEX ESCAPING
exports.searchSeller = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Escape special regular expression operators safely to prevent ReDoS
    const searchTerm = query.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    // Unified aggregation to join User and SellerProfile collections efficiently
    const results = await User.aggregate([
      {
        $match: {
          role: "seller",
          $or: [
            { fullName: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
            { phone: { $regex: searchTerm, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "sellerprofiles", // Assumes your MongoDB collection name is lowercase plural
          localField: "_id",
          foreignField: "userId",
          as: "profile",
        },
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          phone: { $ifNull: ["$phone", { $ifNull: ["$profile.phone", ""] }] },
          trustScore: { $ifNull: ["$profile.trustScore", 0] },
          isVerified: {
            $or: [
              { $eq: ["$verificationStatus", "Approved"] },
              { $ifNull: ["$profile.isVerified", false] }
            ]
          },
          totalDeals: { $ifNull: ["$profile.totalDeals", 0] },
          successfulDeals: { $ifNull: ["$profile.successfulDeals", 0] },
          displayName: { $ifNull: ["$profile.displayName", "$fullName"] },
        },
      },
    ]);

    if (results.length === 0) {
      return res.status(404).json({ message: "No seller found matching that information" });
    }

    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};