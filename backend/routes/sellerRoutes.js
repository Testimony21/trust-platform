const express = require("express");
const router = express.Router();

const {
  createSellerProfile,
  getSellerProfile
} = require("../controllers/sellerController");

const protect = require("../middleware/authMiddleware");

// Create seller profile
router.post("/create", protect, createSellerProfile);

// Get seller profile
router.get("/:userId", getSellerProfile);

module.exports = router;