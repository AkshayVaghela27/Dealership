import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { X } from "lucide-react";

const GetAllBrands = () => {
  const [brands, setBrands] = useState([]);
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

  // Fetch all brands from the backend
  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:6987/api/brands/getbrand");
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:6987/api/dealers/request", formData);
      alert("Request submitted successfully!");
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        brandId: "",
        aadhar: "",
        pan: "",
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Error submitting request");
    }
  };

  // Open the form and set brandId when clicking "Request Dealership"
  const openForm = (brandId) => {
    setShowForm(true);
    setFormData((prev) => ({ ...prev, brandId }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Explore Our Brands</h1>
        <p className="text-gray-600">Find top brands and their dealerships.</p>
      </header>

      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md max-w-4xl mx-auto relative">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 text-left">Brand Name</th>
              <th className="py-3 px-4 text-left">Logo</th>
              <th className="py-3 px-4 text-left">Dealers</th>
              <th className="py-3 px-4 text-left">Want Dealership</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{brand.name}</td>
                <td className="py-3 px-4">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-12 h-12 rounded-full" />
                  ) : (
                    <span className="text-gray-500">No Logo</span>
                  )}
                </td>
                <td className="py-3 px-4">{brand.dealers ? brand.dealers.length : 0} Dealers</td>
                <td className="py-3 px-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => openForm(brand._id)}
                  >
                    Request Dealership
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
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

export default GetAllBrands;
