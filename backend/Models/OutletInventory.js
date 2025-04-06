  const mongoose = require("mongoose");

  const outletInventorySchema = new mongoose.Schema(
    {
      outlet: { type: mongoose.Schema.Types.ObjectId, ref: "Outlet", required: true },
      carModel: { type: mongoose.Schema.Types.ObjectId, ref: "CarModel", required: true },
      quantity: { type: Number, required: true, default: 0 }, // Cars available at the outlet level
    },
    { timestamps: true }
  );

  const OutletInventory = mongoose.model("OutletInventory", outletInventorySchema);

  module.exports = OutletInventory;
