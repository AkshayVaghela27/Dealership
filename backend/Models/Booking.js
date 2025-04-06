const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Stores user who booked
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can be dealer or outlet
  entityType: { type: String, enum: ["Dealer", "Outlet"], required: true }, // Defines if it's dealer or outlet
  date: { type: String, required: true },
  slot: { type: String, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
