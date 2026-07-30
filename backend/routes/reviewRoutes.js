const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createReview,
  getSellerReviews,
  getReviewForDeal,
} = require("../controllers/reviewController");

// Buyer submits a review once the deal is Completed
router.post("/deals/:dealId/review", protect, createReview);

// Deal room checks whether this deal already has a review
router.get("/deals/:dealId/review", protect, getReviewForDeal);

// Public - view all reviews for a seller (seller profile / search results)
router.get("/sellers/:sellerId/reviews", getSellerReviews);

module.exports = router;