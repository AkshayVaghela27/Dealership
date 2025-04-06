const express = require("express");
const { bookTestDrive, getUserTestDrives, updateTestDriveStatus } = require("../Controllers/TestDriveController");
const router = express.Router();

// Route to book a test drive
router.post("/book", bookTestDrive);

// Route to get test drives for a user
router.get("/user/:userId", getUserTestDrives);

// Route to update test drive status (Dealer/Outlet can confirm/reject)
router.put("/update/:testDriveId", updateTestDriveStatus);

module.exports = router;
