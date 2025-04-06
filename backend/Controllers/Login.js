const Brand = require("../Models/Brand");
const Dealer = require("../Models/Dealer");
const Outlet = require("../Models/Outlet");
const User = require("../Models/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user =
      (await Brand.findOne({ "contactInfo.email": email })) ||
      (await Dealer.findOne({ email })) ||
      (await Outlet.findOne({ email })) ||
      (await User.findOne({email}));

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      role: user.role,
      userId: user._id.toString(),
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { login };
