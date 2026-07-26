const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getUserById, getMe } = require("../controllers/userController");

router.get("/me", protect, getMe);
router.get("/:id", protect, getUserById);

module.exports = router;