const mongoose = require("mongoose");
const Booking = require("../Models/Booking"); // Import the Booking model
const getCarTypeReportByBrand = async (req, res) => {
  const { brandId } = req.params; // Get brand ID from request parameters
  
  try {
    const result = await Booking.aggregate([
      {
        $lookup: {
          from: "carmodels", // Lookup to CarModel collection
          localField: "carId",
          foreignField: "_id",
          as: "car"
        }
      },
      { $unwind: "$car" }, // Unwind the car object from the array
      {
        $match: {
          "car.brand": new mongoose.Types.ObjectId(brandId) // Use 'new' keyword to instantiate ObjectId
        }
      },
      {
        $group: {
          _id: "$car.specifications.fuelType", // Group by fuel type (Petrol, Diesel, EV)
          totalBookings: { $sum: 1 }
        }
      },
      { $sort: { totalBookings: -1 } } // Sort by total bookings in descending order
    ]);

    res.status(200).json(result); // Send the result to the client
  } catch (error) {
    console.error("Error generating fuel type report:", error);
    res.status(500).json({ message: "Error generating fuel type report", error });
  }
};

const getCarModelReportByBrand = async (req, res) => {
  const { brandId } = req.params; // Get brand ID from request parameters
  
  try {
    const result = await Booking.aggregate([
      {
        $lookup: {
          from: "carmodels", // Lookup to CarModel collection
          localField: "carId",
          foreignField: "_id",
          as: "car"
        }
      },
      { $unwind: "$car" }, // Unwind the car object from the array
      {
        $match: {
          "car.brand": new mongoose.Types.ObjectId(brandId) // Use 'new' keyword to instantiate ObjectId
        }
      },
      {
        $group: {
          _id: "$car.name", // Group by car model name
          totalBookings: { $sum: 1 }
        }
      },
      { $sort: { totalBookings: -1 } } // Sort by total bookings in descending order
    ]);

    res.status(200).json(result); // Send the result to the client
  } catch (error) {
    console.error("Error generating car model report:", error);
    res.status(500).json({ message: "Error generating car model report", error });
  }
};

module.exports = { getCarTypeReportByBrand, getCarModelReportByBrand };
