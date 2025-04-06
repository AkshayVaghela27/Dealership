const Brand = require("../Models/Brand");
const jwt = require("jsonwebtoken");

const authBrand = async (req, res, next) => {
  try {
    // Extract token from cookies
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) return res.status(401).json({ msg: "Invalid token" });

    // Find brand by ID
    const brand = await Brand.findById(decoded._id);
    if (!brand) return res.status(404).json({ msg: "Brand not found" });

    // Attach brand to request object
    req.brand = brand;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authBrand;
