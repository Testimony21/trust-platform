const mongoose = require("mongoose");
const Review = require("../models/Review");
const Deal = require("../models/Deal");
const SellerProfile = require("../models/SellerProfile");
const Notification = require("../models/Notification");

/**
 * Recompute a seller's aggregate rating and store it on SellerProfile
 * so search/listing pages don't need a live aggregation on every load.
 */
async function recomputeSellerRating(sellerId) {
  const [stats] = await Review.aggregate([
    { $match: { reviewee: sellerId } },
    {
      $group: {
        _id: "$reviewee",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  await SellerProfile.findOneAndUpdate(
    { userId: sellerId },
    {
      averageRating: stats ? Math.round(stats.averageRating * 10) / 10 : 0,
      reviewCount: stats ? stats.reviewCount : 0,
    }
  );
}

// POST /api/deals/:dealId/review
// Buyer leaves a review for the seller once the deal is Completed.
exports.createReview = async (req, res) => {
  try {
    const { dealId } = req.params;
    const { rating, comment } = req.body;
    const buyerId = req.user.id || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(dealId)) {
      return res.status(400).json({ message: "Invalid deal id" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // populate buyer so we can build a readable notification message
    const deal = await Deal.findById(dealId).populate("buyer", "fullName email");

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (deal.buyer._id.toString() !== buyerId.toString()) {
      return res.status(403).json({ message: "Only the buyer on this deal can leave a review" });
    }

    if (deal.status !== "Completed") {
      return res.status(400).json({ message: "Deal must be marked Completed before it can be reviewed" });
    }

    if (deal.buyerReviewed) {
      return res.status(409).json({ message: "You have already reviewed this deal" });
    }

    const review = await Review.create({
      deal: dealId,
      reviewer: buyerId,
      reviewee: deal.seller,
      rating,
      comment,
    });

    deal.buyerReviewed = true;
    await deal.save();

    await recomputeSellerRating(deal.seller);

    // --- Notification: persisted + real-time ---
    const buyerName = deal.buyer.fullName || deal.buyer.email || "A buyer";
    const notification = await Notification.create({
      recipient: deal.seller,
      type: "review",
      message: `${buyerName} left you a ${rating}-star review`,
      relatedDeal: deal._id,
      relatedReview: review._id,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(deal.seller.toString()).emit("newNotification", notification);
    }

    return res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You have already reviewed this deal" });
    }
    console.error("createReview error:", err);
    return res.status(500).json({ message: "Something went wrong submitting the review" });
  }
};

// GET /api/sellers/:sellerId/reviews?page=1&limit=10
// Public - other buyers use this to vet a seller before dealing with them.
exports.getSellerReviews = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid seller id" });
    }

    const [reviews, total] = await Promise.all([
      Review.find({ reviewee: sellerId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("reviewer", "fullName"),
      Review.countDocuments({ reviewee: sellerId }),
    ]);

    return res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("getSellerReviews error:", err);
    return res.status(500).json({ message: "Something went wrong fetching reviews" });
  }
};

// GET /api/deals/:dealId/review
exports.getReviewForDeal = async (req, res) => {
  try {
    const { dealId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(dealId)) {
      return res.status(400).json({ message: "Invalid deal id" });
    }

    const review = await Review.findOne({ deal: dealId }).populate("reviewer", "fullName");
    return res.json(review || null);
  } catch (err) {
    console.error("getReviewForDeal error:", err);
    return res.status(500).json({ message: "Something went wrong fetching the review" });
  }
};