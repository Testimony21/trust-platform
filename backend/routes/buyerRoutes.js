// ===============================
// routes/buyerRoutes.js
// ===============================
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getBuyerDashboard,
  addCheck,
  saveSeller,
  reportSeller,
  verifySeller
} = require("../controllers/buyerController");


router.get("/dashboard", protect, getBuyerDashboard);

router.post("/verify", protect, verifySeller);

router.post("/check", protect, addCheck);

router.post("/save", protect, saveSeller);

router.post("/report", protect, reportSeller);

module.exports = router;