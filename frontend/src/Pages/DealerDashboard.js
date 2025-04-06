import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaStore } from "react-icons/fa";

const DealerDashboard = () => {
  const { userId } = useParams();
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [carModels, setCarModels] = useState([]); // ✅ State for car models
  const [selectedCar, setSelectedCar] = useState(""); // Selected car for stock request
  const [quantity, setQuantity] = useState(""); //
  const [pendingStockRequests, setPendingStockRequests] = useState([]);

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6987/api/dealers/${userId}`
        );
        setDealer(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dealer:", error);
        setLoading(false);
      }
    };

    const fetchOutletRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6987/api/dealers/${userId}/outlet-requests`
        );
        setPendingRequests(response.data); // Fix: Store outlet requests in `pendingRequests`
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchDealer();
    fetchOutletRequests();
    fetchCarModels();
    fetchPendingStockRequests();
  }, [userId]);

  const fetchCarModels = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6987/api/inventory/CarbyDealer/${userId}`
      );

      if (Array.isArray(response.data)) {
        setCarModels(response.data);
      } else {
        setCarModels([]); // Set empty array if response is not an array
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching car models:", error);
      setCarModels([]); // Ensure carModels remains an array
    }
  };

  //✅ Fetch Pending Stock Requests
  const fetchPendingStockRequests = async () => {
    if (!userId) {
      console.error("Dealer ID is undefined!");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:6987/api/stock/stock-requests/dealer/${userId}`
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

  const handleRequestStock = async () => {
    if (!selectedCar || !quantity) {
      alert("Please select a car model and enter quantity.");
      return;
    }

    try {
      await axios.post("http://localhost:6987/api/stock/request-stock", {
        carModel: selectedCar,
        from: userId,
        fromType: "Dealer",
        to: dealer?.brand?._id,
        toType: "Brand",
        quantity,
      });

      alert("Stock request submitted successfully!");
      setSelectedCar("");
      setQuantity("");
    } catch (error) {
      console.error("Error requesting stock:", error);
      alert("Failed to request stock. Please try again.");
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

  const handleVerifyDocs = async (requestId, aadharStatus, panStatus) => {
    try {
      await axios.patch(
        "http://localhost:6987/api/dealers/request/verify-docs",
        {
          requestId,
          aadharStatus,
          panStatus,
        }
      );

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
        `http://localhost:6987/api/dealers/handle-outlet-request`,
        {
          requestId,
          action,
        }
      );

      setPendingRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );

      alert(`Request ${action}d successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request. Please try again`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dealer)
    return <p className="text-center text-red-500">No dealer data found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dealer Dashboard</h1>
        <p className="text-gray-600">
          Welcome,{" "}
          <span className="text-blue-600 font-semibold">{dealer.name}</span>
        </p>
      </div>

      {/* Dealer Information Card */}
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Dealer Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <span className="font-semibold">Dealer Name:</span> {dealer.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {dealer.email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {dealer.phone || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Brand:</span>{" "}
            {dealer.brand?.name || "N/A"}
          </p>
          <p className="col-span-2">
            <span className="font-semibold">Address:</span>{" "}
            {dealer.address || "N/A"}
          </p>
        </div>
      </div>

      {/* Outlet Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
          🏢 Outlet Associated
        </h2>
        {dealer.outlets && dealer.outlets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {dealer.outlets.map((outlet) => (
              <div
                key={outlet._id}
                className="bg-gray-50 p-4 rounded-lg shadow flex items-center"
              >
                <FaStore className="text-blue-500 mr-3 text-2xl" />
                <p className="text-lg font-medium">
                  {outlet.name} ({outlet.address})
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-3">No outlets available.</p>
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
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-3">No car models available.</p>
        )}
      </div>

      {/* Stock Request Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
          📦 Request Stock
        </h2>
        <div className="mt-4 flex flex-col space-y-4">
          <select
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Car Model</option>
            {Array.isArray(carModels) ? (
              carModels.map((car) => (
                <option key={car._id} value={car._id}>
                  {car.name}
                </option>
              ))
            ) : (
              <option disabled>No car models available</option>
            )}
          </select>

          <input
            type="number"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={handleRequestStock}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Request Stock
          </button>
        </div>
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
                      onClick={() => handleStockUpdate(request._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => handleStockUpdate(request._id, "rejected")}
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
          📋 Pending Outlet Requests
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
                          Approve Outlet
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded"
                          onClick={() =>
                            handleRequestAction(request._id, "rejected")
                          }
                        >
                          Reject Outlet
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
  );
};

export default DealerDashboard;
