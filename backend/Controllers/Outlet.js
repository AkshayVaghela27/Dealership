const Dealer = require("../Models/Dealer");
const Outlet = require("../Models/Outlet");
const OutletRequest = require("../Models/OutletRequest");
const bcrypt = require("bcryptjs");
const OutletInventory = require("../Models/OutletInventory");
const DealerInventory = require("../Models/DealerInventory");

const requestOutlet = async (req, res) => {
  try {
    const { name, email, phone, address, dealerId, aadhar, pan } = req.body;
    if (!dealerId)
      return res.status(400).json({ error: "Dealer ID is required." });
    if (!aadhar || !pan)
      return res
        .status(400)
        .json({ error: "Aadhar and PAN image URLs are required." });
    const dealerExists = await Dealer.findById(dealerId);
    if (!dealerExists)
      return res.status(404).json({ error: "Dealer not found." });
    const existingRequest = await OutletRequest.findOne({ email });
    if (existingRequest)
      return res.status(400).json({ error: "Request already exists." });

    const newRequest = new OutletRequest({
      name,
      email,
      phone,
      address,
      dealer: dealerId,
      aadhar, // Store URL directly
      pan,
      status: "pending",
      aadharStatus: "pending",
      panStatus: "pending",
    });
    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully." });
  } catch (err) {
    console.log(err);
  }
};

const getOutletbyId = async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id).populate("dealer");
    if (!outlet) {
      return res.status(404).json({ error: "Outlet not found" });
    }
    res.json(outlet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getallOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.find();
    res.json(outlet);
  } catch (err) {
    console.log(err);
  }
};

const deleteOutlet = async (req, res) => {
  try {
    const { outletId } = req.params;

    const deletedOutlet = await Outlet.findByIdAndDelete(outletId);

    if (!deletedOutlet) {
      return res.status(404).json({ error: "Outlet not found" });
    }
    res.json({ message: "Outlet deleted successfully" });
  } catch (error) {
    console.log("Error deleting outlet:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateOutletPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // ✅ Get outlet ID from authenticated user
    const outletId = req.user._id;

    // ✅ Step 1: Find the outlet
    const outlet = await Outlet.findById(outletId);
    if (!outlet) {
      return res.status(404).json({ error: "Outlet not found" });
    }

    // ✅ Step 2: Verify the current password
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      outlet.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid current password" });
    }

    // ✅ Step 4: Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Step 5: Save the hashed password in the database
    outlet.password = hashedNewPassword;
    await outlet.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating outlet password:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteOutletInventory = async (req, res) => {
  try {
    const { outletInventoryId } = req.params;

    if (!outletInventoryId) {
      return res
        .status(400)
        .json({ message: "Missing outletInventoryId in request parameters." });
    }

    const deletedOutletInventory = await OutletInventory.findByIdAndDelete(
      outletInventoryId
    );

    if (!deletedOutletInventory) {
      return res.status(404).json({ message: "Outlet Inventory not found." });
    }

    res.json({ message: "Outlet Inventory deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting Outlet Inventory:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { deleteOutletInventory };

module.exports = {
  requestOutlet,
  getOutletbyId,
  getallOutlet,
  deleteOutlet,
  updateOutletPassword,
  deleteOutletInventory,
};
