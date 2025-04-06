const User = require("../Models/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const Dealer = require("../Models/Dealer")
const Outlet = require("../Models/Outlet")
const CarModel = require("../Models/CarModels")

const register = async(req,res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, phone, address });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // ✅ Get dealer ID from authenticated user (req.user)
    const userId = req.user._id;

    // ✅ Step 1: Find the dealer by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Dealer not found." });
    }

    // ✅ Step 2: Verify the current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    // ✅ Step 3: Validate the new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long." });
    }

    // ✅ Step 4: Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Step 5: Update and save the dealer’s password
    user.password = hashedNewPassword;
    await user.save();

    // ✅ Step 6: Respond with a success message
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating user password:", error);
    res.status(500).json({ error: "Server error" });
  }
};




module.exports = {register,updatePassword}