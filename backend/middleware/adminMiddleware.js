const adminProtect = (req, res, next) => {
  // Check if req.user exists and has the admin flag checked true
  if (req.user && req.user.isAdmin === true) {
    next(); // Cleared! Run the controller endpoint
  } else {
    res.status(403).json({ message: "Access denied: Administrative clearance required." });
  }
};

module.exports = adminProtect;