import { useState, useContext } from "react";
import AppContext from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { UserRegister } = useContext(AppContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone:"",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    if (!user.name ||  !user.phone || !user.email || !user.address || !user.password) {
      setMessage("All fields are required!");
      setLoading(false);
      return;
    }


    try {
      await UserRegister(
        user.name,
        user.email,
        user.password,
        user.phone,
        user.address,
      );
      setMessage("user registered successfully!");
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to register. Please try again.");
    }

    setLoading(false);
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-950 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">User Signup</h2>
        
        {message && <p className="text-center text-red-500">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="User Name"
            className="p-3 w-full bg-gray-800 text-white  rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="p-3 w-full bg-gray-800 text-white  rounded-md"
            required
          />
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Password"
            className="p-3 w-full bg-gray-800 text-white  rounded-md"
            required
          />
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="p-3 w-full bg-gray-800 text-white  rounded-md"
            required
          />
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
            placeholder="Address"
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
