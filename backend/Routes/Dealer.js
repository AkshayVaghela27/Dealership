const express = require("express");
const router = express.Router();
const {
  requestDealership,
  // login,
  // getProfile,
  getDealerById,
  getallDealer,
  deleteDealer,
  updateDealerPassword,
  verifyDocs,
  handleOutletRequest,
  getOutletRequest,
  deleteDealerInventory
} = require("../Controllers/Dealer");

const authDealer = require("../Middleware/Auth");

// ✅ Route (No Multer Required)
router.post("/request", requestDealership);

// ✅ Dealer Login
// router.post("/login", login);

// ✅ Get Dealer Profile (Protected)
// router.get("/profile", authDealer, getProfile);

router.get("/getdealer",getallDealer)

router.get("/:id",getDealerById)

router.get("/:id/outlet-requests",authDealer,getOutletRequest)

router.put("/request/verify-docs", verifyDocs);

router.post("/handle-outlet-request",authDealer,handleOutletRequest)

router.put("/updatepassword",authDealer,updateDealerPassword)

// ✅ Delete a Dealer (Protected Route)
router.delete("/:dealerId", deleteDealer);

router.delete("/delete-inventory/:dealerInventoryId", deleteDealerInventory);

module.exports = router;
