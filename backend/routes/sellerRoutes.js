const express = require("express");
const router = express.Router();

const {
  createSellerProfile,
  getSellerProfile
} = require("../controllers/sellerController");

const protect = require("../middleware/authMiddleware");

router.post("/create", protect, createSellerProfile);

router.get("/:userId", getSellerProfile);

module.exports = router;