const mongoose = require("mongoose");

const outletRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      required: true,
    }, // Requesting connection with this dealer
  aadhar: { type: String, required: true }, // Store image URL
  pan: { type: String, required: true }, // Store image URL
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  aadharStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  panStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const OutletRequest = mongoose.model("OutletRequest", outletRequestSchema);

module.exports = OutletRequest;
