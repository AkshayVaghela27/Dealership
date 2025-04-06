const TestDrive = require("../Models/TestDrive");
const User = require("../Models/User");

// Book a Test Drive
const bookTestDrive = async (req, res) => {
  try {
    const { userId, carId, locationId, locationType, preferredDate } = req.body;

    // Validate required fields
    if (!userId || !carId || !locationId || !locationType || !preferredDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new test drive request
    const testDrive = new TestDrive({
      userId,
      carId,
      locationId,
      locationType,
      preferredDate,
    });

    await testDrive.save();

    res.status(201).json({ message: "Test drive booked successfully", testDrive });
  } catch (error) {
    console.error("Error booking test drive:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Test Drives for a User
const getUserTestDrives = async (req, res) => {
  try {
    const { userId } = req.params;
    const testDrives = await TestDrive.find({ userId }).populate("carId").sort({ createdAt: -1 });

    res.status(200).json(testDrives);
  } catch (error) {
    console.error("Error fetching test drives:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Test Drive Status (Confirmed or Rejected)
const updateTestDriveStatus = async (req, res) => {
  try {
    const { testDriveId } = req.params;
    const { status } = req.body;

    if (!["Confirmed", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTestDrive = await TestDrive.findByIdAndUpdate(
      testDriveId,
      { status },
      { new: true }
    );

    if (!updatedTestDrive) {
      return res.status(404).json({ message: "Test drive not found" });
    }

    res.status(200).json({ message: "Test drive status updated", updatedTestDrive });
  } catch (error) {
    console.error("Error updating test drive status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { bookTestDrive, getUserTestDrives, updateTestDriveStatus };
