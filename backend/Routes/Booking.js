const express = require("express");
const { getAvailableSlots, bookSlot, getAllBookings } = require("../Controllers/Booking");

const router = express.Router();

// Get available slots
router.get("/available-slots", getAvailableSlots);

// Book a slot
router.post("/book", bookSlot);

// Get all bookings
router.get("/", getAllBookings);

module.exports = router;
