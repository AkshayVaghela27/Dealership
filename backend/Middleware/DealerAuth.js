const jwt = require("jsonwebtoken");
const Dealer = require("../Models/Dealer");

const authDealer = async (req, res, next) => {
  try {
    // Extract token from cookies
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded._id) return res.status(401).json({ msg: "Invalid token" });

    // Find dealer by ID
    const dealer = await Dealer.findById(decoded._id);

    if (!dealer) return res.status(404).json({ msg: "Dealer not found" });

    // Attach dealer to request object
    req.dealer = dealer;
    next();
  } catch (err) {
    console.error(err); // Log the error
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authDealer;
