const express = require("express");
const { getAllCarsWithDealersAndOutlets , getCarDetails } = require("../Controllers/CarController");
const router = express.Router();

router.get("/cars", getAllCarsWithDealersAndOutlets); // Fetch all car models with dealer and outlet info

router.get("/cars/:carId",getCarDetails);

module.exports = router;
