const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Temporary password sent on approval
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, default: "dealer" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }, // Approved brand
    ouletRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "OutletRequest" }], // Outlet requests
    outlets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Outlet" }], // Connected outlets
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

dealerSchema.pre("findOneAndDelete", async function (next) {
  const dealer = await this.model.findOne(this.getQuery()); // Get the dealer being deleted

  if (dealer) {
    await mongoose.model("Brand").updateOne(
      { _id: dealer.brand }, // Find the brand the dealer belongs to
      { $pull: { dealers: dealer._id } } // Remove dealer reference from dealers array
    );
  }

  next();
});

const Dealer = mongoose.model("Dealer", dealerSchema);

module.exports = Dealer;
