const mongoose = require("mongoose");

const TestDriveSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "CarModel", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Dealer or Outlet ID
  locationType: { type: String, enum: ["Dealer", "Outlet"], required: true },
  preferredDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TestDrive", TestDriveSchema);
