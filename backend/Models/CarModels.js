const mongoose = require("mongoose");

const carModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }, // Associated brand
    price: { type: Number, required: true },
    specifications: {
      engine: { type: String, required: true },
      mileage: { type: String, required: true },
      fuelType: { type: String, required: true },
      seatingCapacity: { type: Number, required: true },
    },
    image: { type: String, required: true }, // Image URL or path
  },
  { timestamps: true }
);

const CarModel = mongoose.model("CarModel", carModelSchema);

// carModelSchema.pre("findOneAndDelete", async function (next) {
//   try {
//     const carModel = await this.model.findOne(this.getQuery());

//     if (!carModel) return next();

//     console.log("🚀 Deleting CarModel:", carModel._id);

//     // ✅ Remove CarModel from BrandInventory
//     await mongoose.model("BrandInventory").deleteMany({ carModel: carModel._id });

//     // ✅ Remove CarModel from DealerInventory
//     await mongoose.model("DealerInventory").deleteMany({ carModel: carModel._id });

//     // ✅ Remove CarModel from OutletInventory
//     await mongoose.model("OutletInventory").deleteMany({ carModel: carModel._id });

//     // ✅ Remove CarModel from Brand's `carModels` array
//     await mongoose.model("Brand").updateMany(
//       { carModels: carModel._id },
//       { $pull: { carModels: carModel._id } }
//     );
//     // ✅ 5. Remove CarModel and its quantity from Dealer's `inventory` array
//     await mongoose.model("Dealer").updateMany(
//       { "inventory.carModel": carModel._id },
//       { $pull: { inventory: { carModel: carModel._id } } }
//     );

//     // ✅ 6. Remove CarModel and its quantity from Outlet's `inventory` array
//     await mongoose.model("Outlet").updateMany(
//       { "inventory.carModel": carModel._id },
//       { $pull: { inventory: { carModel: carModel._id } } }
//     );

//     console.log("✅ CarModel removed from all related collections!");

//     next();
//   } catch (error) {
//     console.error("❌ Error in pre-delete hook:", error);
//     next(error);
//   }
// });




module.exports = CarModel;
