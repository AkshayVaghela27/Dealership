const jwt = require("jsonwebtoken");
const Brand = require("../Models/Brand");
const Dealer = require("../Models/Dealer");
const Outlet = require("../Models/Outlet");
const User = require("../Models/User")
const auth = async (req, res, next) => {
  try {
    // Retrieve token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user based on role
    let user;
    switch (decoded.role) {
      case "brand":
        user = await Brand.findById(decoded._id);
        break;
      case "dealer":
        user = await Dealer.findById(decoded._id);
        break;
      case "outlet":
        user = await Outlet.findById(decoded._id);
        break;
      case "customer":
        user = await User.findById(decoded._id)
        break;
      default:
        return res.status(403).json({ message: "Invalid role." });
    }

    if (!user) {
      return res.status(403).json({ message: "User not found." });
    }

    req.user = user;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = auth;
