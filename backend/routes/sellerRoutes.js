const express = require("express");
const router = express.Router();

const {
  createSellerProfile,
  getSellerProfile,
  searchSeller
} = require("../controllers/sellerController");

const protect = require("../middleware/authMiddleware");

// Create seller profile
router.post("/create", protect, createSellerProfile);

// Search sellers
router.post("/search", searchSeller);

// Get seller profile
router.get("/:userId", getSellerProfile);
  


module.exports = router;