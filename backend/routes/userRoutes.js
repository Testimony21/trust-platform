const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getUserById, getMe } = require("../controllers/userController");

router.get("/:id", protect, getUserById);
router.get("/me", protect, getMe);

module.exports = router;