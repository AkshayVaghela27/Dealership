import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaStore } from "react-icons/fa";

const OutletDashboard = () => {
    const { userId } = useParams();
    const [outlet, setOutlet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [carModels , setCarModels] = useState([]); // ✅ State for car models
    const [selectedCar, setSelectedCar] = useState(""); // Selected car for stock request
    const [quantity, setQuantity] = useState(""); // 
  
    useEffect(() => {
      const fetchOutlet = async () => {
        try {
          const response = await axios.get(`http://localhost:6987/api/outlets/${userId}`);
          setOutlet(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching dealer:", error);
          setLoading(false);
        }
      };

      fetchOutlet();
      fetchCarModels();
    })

    const fetchCarModels = () => {
       const response = axios.get(`http://localhost:6987/api/inventory/carbyOutlet/${userId}`)
        .then((response) => setCarModels(response.data))
        .catch((error) => console.error("Error fetching car models:", error));
    }

    const handleRequestStock = async () => {
      if (!selectedCar || !quantity || quantity <= 0) {
        alert("Please select a car model and enter a valid quantity.");
        return;
      }
    
      try {
          await axios.post("http://localhost:6987/api/stock/request-stock", {
          carModel: selectedCar,  // Car model ID
          from: userId,         // Outlet making the request
          to: outlet?.dealer?._id,          // Dealer receiving the request
          fromType: "Outlet",     // Requester is an Outlet
          toType: "Dealer",       // Receiver is a Dealer
          quantity, 
          status: "pending"       // Request starts as pending
        });
    
          alert("Stock request sent successfully!");
          setSelectedCar("");  // Reset form
          setQuantity("");
      } catch (error) {
        console.error("Error requesting stock:", error);
        alert("Failed to send stock request. Please try again.");
      }
    };
    

    if (!outlet) {
      return <div className="text-center mt-10 text-red-600">Outlet not found</div>;
    }
    return(
        <> 
            <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Outlet Dashboard</h1>
        <p className="text-gray-600">
          Welcome, <span className="text-blue-600 font-semibold">{outlet.name}</span>
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Outlet Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <p><span className="font-semibold">Outlet Name:</span> {outlet.name}</p>
          <p><span className="font-semibold">Email:</span> {outlet.email}</p>
          <p><span className="font-semibold">Phone:</span> {outlet.phone || "N/A"}</p>
          <p><span className="font-semibold">Dealer:</span> {outlet.dealer?.name || "N/A"}</p>
          <p className="col-span-2"><span className="font-semibold">Address:</span> {outlet.address || "N/A"}</p>
        </div>
      </div>

      {/* Car Models Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">🚗 Car Models</h2>
          {carModels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {carModels.map((car) => (
                <div key={car._id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded-md" />
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
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">📦 Request Stock</h2>
        <div className="mt-4 flex flex-col space-y-4">
        <select value={selectedCar} onChange={(e) => setSelectedCar(e.target.value)} className="p-2 border rounded">
  <option value="">Select Car Model</option>
  {Array.isArray(carModels) ? (
    carModels.map((car) => <option key={car._id} value={car._id}>{car.name}</option>)
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


      </div>
        </>
    )
}

export default OutletDashboard;