const express = require("express");
const router = express.Router();
const Brand = require("../Models/Brand");
const Dealer = require("../Models/Dealer");
const Outlet = require("../Models/Outlet");
const User = require("../Models/User")
const { login } = require("../Controllers/Login");
const auth = require("../Middleware/Auth");

// ✅ Universal Login for All Roles
router.post("/login", login);

router.get("/auth/me", auth, async (req, res) => {
  try {
    const { user, role } = req;
    res.json({ userId: user._id, role });
  } catch (error) {
    console.error("Auth Me Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get Profile (Protected Route)
router.get("/profile", auth, async (req, res) => {
  try {
    const { user, role } = req;

    let profileData = null;

    if (role === "brand") {
      profileData = await Brand.findById(user).populate("dealers");
    } else if (role === "dealer") {
      profileData = await Dealer.findById(user).populate("brand").populate("outlets");
    } else if (role === "outlet") {
      profileData = await Outlet.findById(user).populate("dealer");
    }
      else if(role === "customer") {
      profileData = await User.findById(user)
    }

    if (!profileData) {
      return res.status(404).json({ msg: `${role} not found` });
    }

    return res.json({
      id: profileData._id,
      name: profileData.name,
      role: profileData.role,
      email: profileData.contactInfo ? profileData.contactInfo.email : profileData.email,  
      phone: profileData.contactInfo ? profileData.contactInfo.phone : profileData.phone, 
      address: profileData.contactInfo ? profileData.contactInfo.address : profileData.address, 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Logout Route (Clears Auth Cookie)
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict",
    });

    res.json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ msg: "Server error during logout" });
  }
});



module.exports = router;