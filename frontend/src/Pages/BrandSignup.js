import { useState, useContext } from "react";
import AppContext from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { register } = useContext(AppContext);
  const navigate = useNavigate();

  const [brand, setBrand] = useState({
    name: "",
    logo: "", 
    phone: "",
    email: "",
    address: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setBrand({ ...brand, [e.target.name]: e.target.value });
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    if (!brand.name || !brand.logo || !brand.phone || !brand.email || !brand.address || !brand.password) {
      setMessage("All fields are required!");
      setLoading(false);
      return;
    }


    try {
      await register(
        brand.name,
        brand.logo,
        brand.phone,
        brand.email,
        brand.address,
        brand.password
      );
      setMessage("Brand registered successfully!");
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to register. Please try again.");
    }

    setLoading(false);
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-950 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Brand Signup</h2>
        
        {message && <p className="text-center text-red-500">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={brand.name}
            onChange={handleChange}
            placeholder="Brand Name"
            className="p-3 w-full bg-gray-800 text-white  rounded-md"
            required
          />
          <input
            type="text"
            name="logo"
            value={brand.logo}
            onChange={handleChange}
            placeholder="Logo URL"
            className="p-3 w-full bg-gray-800 text-white  rounded-md"
            required
          />
          <input
            type="text"
            name="phone"
            value={brand.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="p-3 w-full bg-gray-800 text-white  rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            value={brand.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="p-3 w-full bg-gray-800 text-white  rounded-md"
            required
          />
          <input
            type="text"
            name="address"
            value={brand.address}
            onChange={handleChange}
            placeholder="Address"
            className="p-3 w-full bg-gray-800 text-white  rounded-md"
            required
          />
          <input
            type="password"
            name="password"
            value={brand.password}
            onChange={handleChange}
            placeholder="Password"
            className="p-3 w-full bg-gray-800 text-white  rounded-md"
            required
          />
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
