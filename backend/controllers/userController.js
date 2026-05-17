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

const getMe = async (req, res) => {
    res.json(req.user);
};

module.exports = { getUserById, getMe };