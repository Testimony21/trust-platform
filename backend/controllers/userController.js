const User = require("../models/User");

// GET SINGLE USER (SELLER PROFILE)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CURRENT LOGGED IN USER (LIVE DATABASE SYNC)
const getMe = async (req, res) => {
  try {
    // Safety check on property assignment mapping context
    const userId = req.user.id || req.user._id;

    // 🎯 FIX: Force a fresh database check instead of returning stale token payload data
    const freshUser = await User.findById(userId).select("-password");

    if (!freshUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Wrap in an object matching your AuthContext expectation: res.data.user
    res.status(200).json({ user: freshUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUserById, getMe };