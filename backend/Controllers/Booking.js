const Booking = require("../Models/Booking");
const Car = require("../Models/CarModels");
const User = require("../Models/User");
const mongoose = require('mongoose');
const Dealer = require("../Models/Dealer");
const Outlet = require("../Models/Outlet");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Set to `true` if using SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

// Get available slots for a specific date & entity
const getAvailableSlots = async (req, res) => {
  try {
    const { entityId, entityType, date } = req.query;

    // Fetch existing bookings for the given entity and date
    const existingBookings = await Booking.find({ entityId, entityType, date });

    // Define available slots (Adjust timings as needed)
    const allSlots = [
      "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM",
      "12:30 PM", "01:00 PM", "02:00 PM", "02:30 PM", "03:00 PM",
      "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
    ];

    // Find booked slots
    const bookedSlots = existingBookings.map((booking) => booking.slot);

    // Filter available slots
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Error fetching slots", error });
  }
};

// Book a test drive slot
const bookSlot = async (req, res) => {
    try {
      const { userId, carId, entityId, entityType, date, slot } = req.body;
  
      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid userId:", userId);
        return res.status(400).json({ message: "Invalid userId" });
      }
  
      const bookingDate = new Date(date);
        const today = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(today.getMonth() + 1);
       
        // Check if the date is within the allowed range
        if (bookingDate < today || bookingDate > oneMonthLater) {
            return res.status(400).json({ message: "Booking must be within today and one month from today" });
        }
      // Fetch user, car, and dealer/outlet details
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const car = await Car.findById(carId);
      if (!car) return res.status(404).json({ message: "Car not found" });
  
      let entity;
      if (entityType === "Dealer") {
        entity = await Dealer.findById(entityId);
      } else if (entityType === "Outlet") {
        entity = await Outlet.findById(entityId);
      }
  
      if (!entity) {
        return res.status(404).json({ message: `${entityType} not found` });
      }
  
      // Check existing bookings for the same slot
      const existingBookings = await Booking.find({ entityId, entityType, date });
      if (existingBookings.length >= 15) {
        return res.status(400).json({ message: "All slots are booked for this entity on this date" });
      }
  
      const isSlotBooked = existingBookings.some((booking) => booking.slot === slot);
      if (isSlotBooked) {
        return res.status(400).json({ message: "Selected slot is already booked" });
      }
  
      // Save new booking
      const newBooking = new Booking({ userId, carId, entityId, entityType, date, slot });
      await newBooking.save();
  
      // Email details (both emails will be sent from SMTP_USER)
      const senderEmail = process.env.SMTP_USER;
      const userEmail = user.email;
      const entityEmail = entity.email; // Always send from SMTP_USER instead of fake emails
  
      // Email to User (Booking Confirmation)
      const mailOptionsUser = {
        from: `"${entity.name}" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: `Test Drive Confirmation - ${car.name} on ${date}`,
        messageId: `user-${Date.now()}@yourdomain.com`,  // Unique ID
        text: `Hello ${user.name},\n\nYour test drive for ${car.name} has been confirmed!\n\n📅 Date: ${date}\n⏰ Slot: ${slot}\n🚘 Dealer/Outlet: ${entity.name}\n📍 Location: ${entity.address}\n\nBest Regards,\n${entity.name}`,
      };
      
      const mailOptionsDealer = {
        from: `"${entity.name}" <${process.env.SMTP_USER}>`,
        to: entityEmail,
        replyTo: entityEmail,  // Replies go to dealer/outlet
        subject: `New Test Drive Booking - ${car.name} on ${date}`,
        messageId: `dealer-${Date.now()}@yourdomain.com`,  // Unique ID
        text: `Hello ${entity.name},\n\nA new test drive has been booked.\n\n👤 Customer: ${user.name}\n📧 Email: ${user.email}\n🚘 Car: ${car.name}\n📅 Date: ${date}\n⏰ Slot: ${slot}\n\nPlease be ready for the test drive.\n\nBest Regards,\n${entity.name}`,
      };
      
      
  
      // Send both emails from the same SMTP_USER
      await transporter.sendMail(mailOptionsUser);
      await transporter.sendMail(mailOptionsDealer);
      res.status(201).json({ message: "Slot booked successfully and emails sent", booking: newBooking });
  
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ message: "Error booking slot", error: error.message });
    }
  };
  
// Get all bookings (optional)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId carId");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

module.exports = { getAvailableSlots, bookSlot, getAllBookings };
