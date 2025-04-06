const mongoose = require("mongoose");

const brandInventorySchema = new mongoose.Schema(
    {
      brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
      carModel: { type: mongoose.Schema.Types.ObjectId, ref: "CarModel", required: true },
      quantity: { type: Number, required: true, default: 0 }, // Cars at brand level
  
      dealerStock: [
        {
          dealer: { type: mongoose.Schema.Types.ObjectId, ref: "Dealer" }, // ✅ Correct
          quantity: { type: Number, default: 0 }, // Dealer stock
        },
      ],
    },
    { timestamps: true }
  );

const BrandInventory = mongoose.model("BrandInventory", brandInventorySchema);

module.exports = BrandInventory;