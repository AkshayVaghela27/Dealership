import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const GetAllDealers = () => {
  const [dealers, setDealers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    brandId: "",
    aadhar: "", // Store Aadhar URL
    pan: "", // Store PAN URL
  });
  const fetchDealers = async () => {
    try {
      const response = await axios.get(`http://localhost:6987/api/dealers/getdealer`);
      setDealers(response.data);
    } catch (error) {
      console.error("Error fetching dealers:", error);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:6987/api/outlets/request", formData);
      alert("Request submitted successfully!");
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        dealerId: "",
        aadhar: "", // Store Aadhar URL
        pan: "", // Store PAN URL
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Error submitting request");
    }
  };

  const openForm = (dealerId) => {
    setShowForm(true);
    setFormData((prev) => ({ ...prev, dealerId }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Explore Our Dealers</h1>
        <p className="text-gray-600">Find trusted dealers and their locations.</p>
      </header>

      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md max-w-5xl mx-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-3 px-4 text-left">Dealer Name</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Brand</th>
              <th className="py-3 px-4 text-left">Contact</th>
              <th className="py-3 px-4 text-left">Outlets</th>
              <th className="py-3 px-4 text-left">Want Outlet</th>
            </tr>
          </thead>
          <tbody> 
            {dealers.map((dealer) => (
              <tr key={dealer._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{dealer.name}</td>
                <td className="py-3 px-4">{dealer.address}</td>
                <td className="py-3 px-4">{dealer.brand?.name || "N/A"}</td>
                <td className="py-3 px-4">{dealer.phone}</td>
                <td className="py-3 px-4">
                  {dealer.outlets.length > 0 ? `${dealer.outlets.length} Outlets` : "No Outlets"}
                </td>
                <td className="py-3 px-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => openForm(dealer._id)}
                  >
                    Request Outlet
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
              onClick={() => setShowForm(false)}
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4">Request Dealership</h2>
            <form onSubmit={handleSubmit}>
              {["name", "email", "phone", "address"].map((field) => (
                <div className="mb-2" key={field}>
                  <label className="block text-sm font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    className="w-full p-2 border rounded"
                    placeholder={`Enter your ${field}`}
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}

              {/* Aadhar URL */}
              <div className="mb-2">
                <label className="block text-sm font-medium">Aadhar Card URL:</label>
                <input
                  type="text"
                  name="aadhar"
                  className="w-full p-2 border rounded"
                  placeholder="Enter Aadhar Document URL"
                  value={formData.aadhar}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* PAN URL */}
              <div className="mb-2">
                <label className="block text-sm font-medium">PAN Card URL:</label>
                <input
                  type="text"
                  name="pan"
                  className="w-full p-2 border rounded"
                  placeholder="Enter PAN Document URL"
                  value={formData.pan}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-white rounded w-full">
                Submit
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>

    
  );
};

export default GetAllDealers;
