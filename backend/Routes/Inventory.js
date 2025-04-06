const express = require("express");
const { addCarWithStock , deleteCarModel , carmodelbyBrand , carmodelbyDealer , carmodelbyOutlet} = require("../Controllers/Inventory");
const Auth = require("../Middleware/Auth");
const router = express.Router();

router.post("/add-car", Auth ,addCarWithStock); // API endpoint to add a car with stock

router.get("/CarbyBrand/:brandId",carmodelbyBrand); // API endpoint to get car by brand

router.get("/CarbyDealer/:dealerId",carmodelbyDealer)

router.get("/carbyOutlet/:outletId",carmodelbyOutlet)

router.delete("/:carModel",deleteCarModel); // API endpoint to delete a car model

module.exports = router;
