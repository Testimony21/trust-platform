// middleware/adminMiddleware.js

module.exports = function (req, res, next) {
  // Safeguard: check if the user object was attached by the auth middleware
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. No user context found." });
  }

  // Check both the role enum string AND the boolean flag for absolute safety
  const hasAdminRole = req.user.role === "admin";
  const hasAdminFlag = req.user.isAdmin === true;

  if (hasAdminRole || hasAdminFlag) {
    return next(); // Account authorized, proceed to the KYC queue data pipeline
  }

  // If neither matches, explicitly reject the profile request
  return res.status(403).json({ 
    success: false,
    message: "Access denied. Administrative compliance privileges required." 
  });
};