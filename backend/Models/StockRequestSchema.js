const mongoose = require("mongoose");

const stockRequestSchema = new mongoose.Schema(
  {
    carModel: { type: mongoose.Schema.Types.ObjectId, ref: "CarModel", required: true },
    
    from: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "fromType" }, // Who is requesting
    fromType: { type: String, enum: ["Dealer", "Outlet"], required: true }, // Requester type
    
    to: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "toType" }, // Who is approving
    toType: { type: String, enum: ["Brand", "Dealer"], required: true }, // Approver type
    
    quantity: { type: Number, required: true },
    
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // Request status
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockRequest", stockRequestSchema);
