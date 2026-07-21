const User = require("../models/User");
const SellerProfile = require("../models/SellerProfile");
const BuyerProfile = require("../models/BuyerProfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // FIXED: Intercept the role assignment using your production environment variables whitelist
    const adminEmailsEnv = process.env.SYSTEM_ADMIN_EMAILS || "";
    const allowedAdmins = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase());

    let assignedRole = role; // Fallback to what the frontend sent (buyer/seller)
    if (allowedAdmins.includes(email.trim().toLowerCase())) {
      assignedRole = "admin";
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(), // Save normalized email
      password: hashedPassword,
      phone,
      role: assignedRole // Securely assigned role
    });

    // Auto create buyer profile
    if (user.role === "buyer") {
      await BuyerProfile.create({
        userId: user._id
      });
    }

    // Auto create seller profile
    if (user.role === "seller") {
      await SellerProfile.create({
        userId: user._id,
        displayName: user.fullName,
        phone: user.phone,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    // FIXED: Wrapped in an object structure so AuthContext.jsx's `setUser(res.data.user)` works cleanly on page refreshes
    res.json({
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};