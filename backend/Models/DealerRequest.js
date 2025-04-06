const mongoose = require("mongoose");

const DealerRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  aadhar: { type: String, required: true }, // Store image URL
  pan: { type: String, required: true }, // Store image URL
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  aadharStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  panStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
});

module.exports = mongoose.model("DealerRequest", DealerRequestSchema);
