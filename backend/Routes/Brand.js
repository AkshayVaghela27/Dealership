const express = require("express");
const router = express.Router();
const {
  register,
  getBrandById,
  getallBrand,
  getDealershipRequests,
  handleDealershipRequest,
  verifyDocs
} = require("../Controllers/Brand");

const authBrand = require("../Middleware/Auth");

// ✅ Register a Brand
router.post("/register", register);

// ✅ Get All Brands
router.get("/getbrand", getallBrand);


// ✅ Get Brand by ID (Place it before any other routes with parameters)
router.get("/:id", getBrandById);

// ✅ Get All Dealership Requests (For a Specific Brand) (Protected)
router.get("/:id/dealership-requests", authBrand, getDealershipRequests);

// ✅ Handle Dealership Request (Approve/Reject) (Protected)
router.put("/request/verify-docs", verifyDocs);

router.post("/handle-dealership-request", authBrand, handleDealershipRequest);

module.exports = router;
