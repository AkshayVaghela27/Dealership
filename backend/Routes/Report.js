const express = require("express");
const router = express.Router();
const Auth = require("../Middleware/Auth");
const { getCarTypeReportByBrand, getCarModelReportByBrand } = require("../Controllers/Report");

// Route to get fuel type report for a specific brand
router.get("/report/:brandId/car-type", Auth,getCarTypeReportByBrand);

// Route to get car model report for a specific brand
router.get("/report/:brandId/car-model",Auth, getCarModelReportByBrand);

module.exports = router;
