import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaCar, FaEnvelope, FaPhone, FaStore } from "react-icons/fa";
import ReportAnalysis from "./ReportAnalysis";

const BrandDashboard = () => {
  const { userId } = useParams();
  const [brand, setBrand] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [carModels, setCarModels] = useState([]); // ✅ State for car models
  const [showForm, setShowForm] = useState(false);
  const [pendingStockRequests, setPendingStockRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("reports");
  const [newCar, setNewCar] = useState({
    name: "",
    price: "",
    quantity: "",
    image: "",
    specifications: {
      engine: "",
      mileage: "",
      fuelType: "",
      seatingCapacity: "",
    },
  });

  // Fetch brand details
  useEffect(() => {
    axios
      .get(`http://localhost:6987/api/brands/${userId}`)
      .then((response) => setBrand(response.data))
      .catch((error) => console.error("Error fetching brand:", error));

    // Fetch pending requests
    fetchPendingRequests();

    // Fetch car models for this brand
    fetchCarModels();

    fetchPendingStockRequests();
  }, [userId]);

  // ✅ Function to fetch pending dealership requests
  const fetchPendingRequests = () => {
    axios
      .get(`http://localhost:6987/api/brands/${userId}/dealership-requests`)
      .then((response) => setPendingRequests(response.data))
      .catch((error) => console.error("Error fetching requests:", error));
  };

  // ✅ Function to fetch car models by brand
  const fetchCarModels = () => {
    axios
      .get(`http://localhost:6987/api/inventory/CarbyBrand/${userId}`) // API to get car models by brand
      .then((response) => setCarModels(response.data))
      .catch((error) => console.error("Error fetching car models:", error));
  };
  //✅ Fetch Pending Stock Requests
  const fetchPendingStockRequests = async () => {
    if (!userId) {
      console.error("Brand ID is undefined!");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:6987/api/stock/stock-requests/${userId}`
      );

      // ✅ Only show "pending" requests
      const pendingRequests = response.data.filter(
        (request) => request.status === "pending"
      );

      setPendingStockRequests(pendingRequests);
    } catch (error) {
      console.error("❌ Error fetching stock requests:", error);
    }
  };

  // ✅ Function to handle approval/rejection
  const handleVerifyDocs = async (requestId, aadharStatus, panStatus) => {
    try {
      await axios.put("http://localhost:6987/api/brands/request/verify-docs", {
        requestId,
        aadharStatus,
        panStatus,
      });

      // Update state to reflect the verification status
      setPendingRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, aadharStatus, panStatus } : req
        )
      );

      alert("Document status updated successfully!");
    } catch (error) {
      console.error("Error verifying documents:", error);
      alert("Failed to update document status.");
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.post(
        "http://localhost:6987/api/brands/handle-dealership-request",
        {
          requestId,
          action,
        }
      );

      // Remove the request from the pending list after approval/rejection
      setPendingRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );

      alert(`Request ${action}d successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request. Please try again.`);
    }
  };

  const handleStockUpdate = async (requestId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:6987/api/stock/update-stock/${requestId}`, // Make sure this is the correct API URL
        { status }
      );

      // ✅ Remove the approved/rejected request from UI immediately
      setPendingStockRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside 2xx
        console.error("❌ Error Response:", error.response.data);
        alert(error.response.data.message);
      } else if (error.request) {
        // No response received
        console.error("❌ No Response from Server", error.request);
        alert("Server is not responding. Please try again later.");
      } else {
        // Other errors
        console.error("❌ Unexpected Error:", error.message);
        alert("Something went wrong!");
      }
    }
  };

  // ✅ Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert numeric fields to numbers
    const numericFields = ["quantity", "price"];
    const numericSpecifications = ["seatingCapacity"];

    if (name in newCar.specifications) {
      setNewCar((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [name]: numericSpecifications.includes(name) ? Number(value) : value, // ✅ Convert seatingCapacity to number
        },
      }));
    } else {
      setNewCar((prev) => ({
        ...prev,
        [name]: numericFields.includes(name) ? Number(value) : value, // ✅ Convert quantity and price to number
      }));
    }
  };

  // ✅ Handle Add Car
  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:6987/api/inventory/add-car", {
        ...newCar,
        brandId: userId, // Send brandId
      });

      alert("Car added successfully!");
      setNewCar({
        name: "",
        price: "",
        quantity: "",
        image: "",
        specifications: {
          engine: "",
          mileage: "",
          fuelType: "",
          seatingCapacity: "",
        },
      });

      setShowForm(false); // ✅ Close form after submission
      fetchCarModels(); // Refresh car list
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Failed to add car. Please try again.");
    }
  };

  if (!brand)
    return (
      <p className="text-center text-xl font-medium text-gray-600">
        Loading brand data...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between">
        <img src={brand.logo} alt={brand.name} className="w-28 h-auto" />

        <button
          className={`px-4 py-2 text-lg ${
            activeTab === "reports" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() =>
            setActiveTab((prev) => (prev === "reports" ? null : "reports"))
          }
        >
          Reports
        </button>
      </nav>

      {/* Overlay Report */}
      {activeTab === "reports" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
              onClick={() => setActiveTab(null)}
            >
              &times;
            </button>

            <ReportAnalysis brandId={userId} />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-8">
        {/* Brand Overview Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
          <img
            src={brand.logo}
            alt={brand.name}
            className="w-32 h-32 object-contain rounded-lg border p-2 bg-gray-50"
          />
          <div className="ml-6">
            <h1 className="text-3xl font-bold text-gray-800">{brand.name}</h1>
            <p className="text-gray-600 mt-2 text-lg">{brand.description}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
            📞 Contact Information
          </h2>
          <div className="mt-4 text-gray-700">
            <p className="flex items-center">
              <FaEnvelope className="text-blue-600 mr-2" />
              {brand.contactInfo.email}
            </p>
            <p className="flex items-center mt-2">
              <FaPhone className="text-green-600 mr-2" />
              {brand.contactInfo.phone}
            </p>
          </div>
        </div>

        {/* Dealers Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
            🏢 Dealers Associated
          </h2>
          {brand.dealers && brand.dealers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {brand.dealers.map((dealer) => (
                <div
                  key={dealer._id}
                  className="bg-gray-50 p-4 rounded-lg shadow flex items-center"
                >
                  <FaStore className="text-blue-500 mr-3 text-2xl" />
                  <p className="text-lg font-medium">
                    {dealer.name} ({dealer.address})
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-3">No dealers available.</p>
          )}
        </div>

        {/* Car Models Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
            🚗 Car Models
          </h2>
          {carModels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {carModels.map((car) => (
                <div key={car._id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold mt-3">{car.name} </h3>
                  <p className="text-gray-600">Price: ₹{car.price}</p>
                  <p className="text-gray-600">Quantity: {car.quantity}</p>
                  <p className="text-gray-600">
                    Engine: {car.specifications.engine}
                  </p>
                  <p className="text-gray-600">
                    Mileage: {car.specifications.mileage}
                  </p>
                  <p className="text-gray-600">
                    Fuel Type: {car.specifications.fuelType}
                  </p>
                  <p className="text-gray-600">
                    Seating: {car.specifications.seatingCapacity}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-3">No car models available.</p>
          )}
        </div>

        {/* ✅ Toggle Add Car Form */}
        <div className="mt-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white py-2 px-4 rounded w-full"
          >
            {showForm ? "Close Form ✖️" : "Add Car ➕"}
          </button>

          {showForm && (
            <div className="mt-4 bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                ➕ Add a New Car
              </h2>
              <form
                onSubmit={handleAddCar}
                className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  name="name"
                  value={newCar.name}
                  onChange={handleInputChange}
                  placeholder="Car Name"
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={newCar.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  name="quantity"
                  value={newCar.quantity}
                  onChange={handleInputChange}
                  placeholder="Quantity"
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="image"
                  value={newCar.image}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="engine"
                  value={newCar.specifications.engine}
                  onChange={handleInputChange}
                  placeholder="Engine"
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="mileage"
                  value={newCar.specifications.mileage}
                  onChange={handleInputChange}
                  placeholder="Mileage"
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="fuelType"
                  value={newCar.specifications.fuelType}
                  onChange={handleInputChange}
                  placeholder="Fuel Type"
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  name="seatingCapacity"
                  value={newCar.specifications.seatingCapacity}
                  onChange={handleInputChange}
                  placeholder="Seating Capacity"
                  className="border p-2 rounded"
                  required
                />
                <button
                  type="submit"
                  className="col-span-2 bg-green-600 text-white py-2 px-4 rounded"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
            📦 Pending Stock Requests
          </h2>
          {pendingStockRequests.length > 0 ? (
            <table className="w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3 text-left">Car Model</th>
                  <th className="border p-3 text-left">Dealer</th>
                  <th className="border p-3 text-left">Quantity</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingStockRequests.map((request) => (
                  <tr key={request._id} className="border">
                    <td className="border p-3">{request.carModel.name}</td>
                    <td className="text-sm text-gray-500">
                      Requested By: {request.from?.name || "Unknown"}
                    </td>

                    <td className="border p-3">{request.quantity}</td>
                    <td className="border p-3 flex gap-2">
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        onClick={() =>
                          handleStockUpdate(request._id, "approved")
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() =>
                          handleStockUpdate(request._id, "rejected")
                        }
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 mt-3">No pending stock requests.</p>
          )}
        </div>

        {/* Pending Dealership Requests */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
            📋 Pending Dealership Requests
          </h2>
          {pendingRequests.length > 0 ? (
            <table className="w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3 text-left">Name</th>
                  <th className="border p-3 text-left">Email</th>
                  <th className="border p-3 text-left">Phone</th>
                  <th className="border p-3 text-left">Address</th>
                  <th className="border p-3 text-left">Aadhar</th>
                  <th className="border p-3 text-left">PAN</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request._id} className="border">
                    <td className="border p-3">{request.name}</td>
                    <td className="border p-3">{request.email}</td>
                    <td className="border p-3">{request.phone}</td>
                    <td className="border p-3">{request.address}</td>

                    {/* Aadhar Verification with Image */}
                    <td className="border p-3">
                      <img
                        src={request.aadhar}
                        alt="Aadhar"
                        className="w-20 h-12 object-cover border border-gray-400 rounded cursor-pointer"
                        onClick={() => window.open(request.aadhar, "_blank")}
                      />
                      {request.aadharStatus === "approved" ? (
                        <span className="text-green-600 font-semibold block mt-1">
                          ✔ Approved
                        </span>
                      ) : request.aadharStatus === "rejected" ? (
                        <span className="text-red-600 font-semibold block mt-1">
                          ❌ Rejected
                        </span>
                      ) : (
                        <div className="flex gap-2 mt-1">
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded"
                            onClick={() =>
                              handleVerifyDocs(
                                request._id,
                                "approved",
                                request.panStatus
                              )
                            }
                          >
                            Approve Aadhar
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded"
                            onClick={() =>
                              handleVerifyDocs(
                                request._id,
                                "rejected",
                                request.panStatus
                              )
                            }
                          >
                            Reject Aadhar
                          </button>
                        </div>
                      )}
                    </td>

                    {/* PAN Verification with Image */}
                    <td className="border p-3">
                      <img
                        src={request.pan}
                        alt="PAN"
                        className="w-20 h-12 object-cover border border-gray-400 rounded cursor-pointer"
                        onClick={() => window.open(request.pan, "_blank")}
                      />
                      {request.panStatus === "approved" ? (
                        <span className="text-green-600 font-semibold block mt-1">
                          ✔ Approved
                        </span>
                      ) : request.panStatus === "rejected" ? (
                        <span className="text-red-600 font-semibold block mt-1">
                          ❌ Rejected
                        </span>
                      ) : (
                        <div className="flex gap-2 mt-1">
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded"
                            onClick={() =>
                              handleVerifyDocs(
                                request._id,
                                request.aadharStatus,
                                "approved"
                              )
                            }
                          >
                            Approve PAN
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded"
                            onClick={() =>
                              handleVerifyDocs(
                                request._id,
                                request.aadharStatus,
                                "rejected"
                              )
                            }
                          >
                            Reject PAN
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Show Approve/Reject Outlet Buttons */}
                    <td className="border p-3">
                      {request.aadharStatus === "approved" &&
                      request.panStatus === "approved" ? (
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 bg-green-500 text-white rounded"
                            onClick={() =>
                              handleRequestAction(request._id, "approved")
                            }
                          >
                            Approve Dealership
                          </button>
                          <button
                            className="px-4 py-2 bg-red-500 text-white rounded"
                            onClick={() =>
                              handleRequestAction(request._id, "rejected")
                            }
                          >
                            Reject Dealership
                          </button>
                        </div>
                      ) : request.aadharStatus === "rejected" ||
                        request.panStatus === "rejected" ? (
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded"
                          onClick={() =>
                            handleRequestAction(request._id, "rejected")
                          }
                        >
                          Reject Outlet
                        </button>
                      ) : (
                        <span className="text-gray-500">Documents Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 mt-3">No pending requests.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;
