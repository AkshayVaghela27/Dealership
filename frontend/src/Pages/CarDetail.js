import { useEffect, useState,useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingModal from "./BookingModal"; // Import the BookingModal component
import AppContext from "../Context/AppContext"; // Import AppContext


const CarDetails = () => {
  const { carId } = useParams();
  const { user } = useContext(AppContext); // Get user object

  const [car, setCar] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const userId = user?.id

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:6987/api/cars/${carId}`);
        setCar(res.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };
    fetchCarDetails();
  }, [carId]);

  if (!car) return <p className="text-center text-gray-600 mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center">
          <img src={car.image} alt={car.name} className="w-full max-w-sm object-contain rounded-lg shadow-md" />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-800">{car.name}</h2>
          <p className="text-lg text-gray-600 mt-2">Brand: <span className="font-semibold">{car.brand.name}</span></p>
          <p className="text-lg text-gray-600">Price: <span className="font-semibold">₹{car.price}</span></p>

          <h3 className="text-xl font-semibold text-gray-800 mt-4">Specifications</h3>
          <ul className="mt-2 text-gray-600 space-y-1">
            <li>⚙️ Engine: {car.specifications.engine}</li>
            <li>⛽ Fuel Type: {car.specifications.fuelType}</li>
            <li>🚗 Mileage: {car.specifications.mileage}</li>
            <li>🪑 Seating Capacity: {car.specifications.seatingCapacity}</li>
          </ul>

          {/* Open Booking Modal Button */}
          <button
            className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
            onClick={() => setShowBookingModal(true)}
          >
            Book Test Drive
          </button>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal car={car} userId={userId} onClose={() => setShowBookingModal(false)} />
      )}
    </div>
  );
};

export default CarDetails;
