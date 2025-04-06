const express = require("express");
const { requestStock,updateStockRequest} = require("../Controllers/Stock");
const Auth = require("../Middleware/Auth");
const router = express.Router();
const StockRequest = require("../Models/StockRequestSchema")
const CarModel = require("../Models/CarModels")
const Outlet = require("../Models/Outlet")
const Dealer = require("../Models/Dealer")
const Brand = require("../Models/Brand")

router.post("/request-stock",Auth, requestStock); // Dealer → Brand OR Outlet → Dealer
  
router.get("/stock-requests/:brandId", async (req, res) => {
    try {
      const stockRequests = await StockRequest.find({ to: req.params.brandId})
        .populate("carModel") // Populate car model
        .populate("from") // Populate from (Dealer/Outlet)
        .populate("to"); // Populate to (Brand/Dealer)
  
      res.status(200).json(stockRequests);
    } catch (error) {
      console.error("Error fetching stock requests:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/stock-requests/dealer/:dealerId", async (req, res) => {
    try {
      const stockRequests = await StockRequest.find({ to: req.params.dealerId, status: "pending" })
        .populate("carModel") // Populate car model details
        .populate("from") // Populate from (Outlet)
        .populate("to"); // Populate to (Dealer)
    
      res.status(200).json(stockRequests);
    } catch (error) {
      console.error("Error fetching stock requests for dealer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
router.put("/update-stock/:requestId", Auth, updateStockRequest);

module.exports = router;  