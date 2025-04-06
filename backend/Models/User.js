const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  role: { type: String, default: "customer" }, // Role (default is customer)

  inquiries: [
    {
      carModel: { type: mongoose.Schema.Types.ObjectId, ref: "CarModel" },
      message: { type: String },
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      createdAt: { type: Date, default: Date.now }
    }
  ],

  bookings: [
    {
      carModel: { type: mongoose.Schema.Types.ObjectId, ref: "CarModel" },
      dealer: { type: mongoose.Schema.Types.ObjectId, ref: "Dealer" },
      outlet: { type: mongoose.Schema.Types.ObjectId, ref: "Outlet" },
      status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
      bookedAt: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
