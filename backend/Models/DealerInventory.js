const mongoose = require("mongoose");

const dealerInventorySchema = new mongoose.Schema(
  {
    dealer: { type: mongoose.Schema.Types.ObjectId, ref: "Dealer", required: true }, // The dealer who owns this inventory
    carModel: { type: mongoose.Schema.Types.ObjectId, ref: "CarModel", required: true }, // The car model being tracked
    quantity: { type: Number, required: true, default: 0 }, // Cars available at the dealer level

    outletStock: [
      {
        outlet: { type: mongoose.Schema.Types.ObjectId, ref: "Outlet" }, // ✅ Correct reference
        quantity: { type: Number, default: 0 }, // Cars available at the outlet level
      },
    ],
  },
  { timestamps: true }
);

const DealerInventory = mongoose.model("DealerInventory", dealerInventorySchema);

module.exports = DealerInventory;
