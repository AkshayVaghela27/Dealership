const mongoose = require("mongoose");

const outletSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Temporary password sent on approval
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, default: "outlet" },
    dealer: { type: mongoose.Schema.Types.ObjectId, ref: "Dealer", required: true }, // Approved dealer
    inventory: [
      {
        carModel: { type: mongoose.Schema.Types.ObjectId, ref: "CarModel" },
        quantity: { type: Number, default: 0 },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

outletSchema.pre("findOneAndDelete", async function (next) {
  const outlet = await this.model.findOne(this.getQuery()); // Get the outlet being deleted

  if (outlet) {
    await mongoose.model("Dealer").updateOne(
      { _id: outlet.dealer }, // Find the dealer the outlet belongs to
      { $pull: { outlets: outlet._id } } // Remove outlet reference from outlets array
    );
  }

  next();
});

const Outlet = mongoose.model("Outlet", outletSchema);

module.exports = Outlet;
