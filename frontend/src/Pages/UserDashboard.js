import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate()

  useEffect(() => {
    fetchCars();
    fetchBrands();
  }, []);

  // Fetch all brands for dropdown
  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:6987/api/brands/getbrand");
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Fetch cars with filters
  const fetchCars = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (search) queryParams.append("search", search);
      if (selectedBrand) queryParams.append("brand", selectedBrand);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);

      const res = await axios.get(`http://localhost:6987/api/cars?${queryParams.toString()}`);
      setCars(res.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">Available Cars</h2>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mt-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by car name..."
          className="border p-2 rounded-md w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Brand Filter */}
        <select
          className="border p-2 rounded-md"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>{brand.name}</option>
          ))}
        </select>

        {/* Price Filters */}
        <input
          type="number"
          placeholder="Min Price"
          className="border p-2 rounded-md w-24"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="border p-2 rounded-md w-24"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        {/* Apply Filters Button */}
        <button onClick={fetchCars} className="bg-blue-500 text-white px-4 py-2 rounded">
          Apply Filters
        </button>
      </div>

      {/* Car Listings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {cars.map((car) => (
          <div key={car._id} className="bg-white p-4 shadow rounded-lg">
            <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{car.name}</h3>
            <p className="text-gray-600">Brand: {car.brand.name}</p>
            <p className="text-gray-600">Price: ₹{car.price}</p>
            <h4 className="text-md font-semibold mt-2">Available Dealers:</h4>
            {car.dealers.map((dealer) => (
              <p key={dealer.id} className="text-gray-500">
                {dealer.name} - {dealer.address}
              </p>
            ))}
            <h4 className="text-md font-semibold mt-2">Available Outlets:</h4>
            {car.outlets.map((outlet) => (
              <p key={outlet.id} className="text-gray-500">
                {outlet.name} - {outlet.address} (Dealer: {outlet.dealer})
              </p>
            ))}
            <button 
            onClick={() => navigate(`/cars/${car._id}`)} 
            className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
          >
            View Details
          </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
