import { useEffect, useState } from "react";
import axios from "axios";

const BookingModal = ({ car, userId, onClose }) => {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch available slots when date or entity changes
  useEffect(() => {
    if (selectedEntity && selectedDate) {
      fetchSlots();
    }
  }, [selectedEntity, selectedDate]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const res = await axios.get(`http://localhost:6987/api/available-slots`, {
        params: {
          entityId: selectedEntity.value,
          entityType: selectedEntity.type,
          date: selectedDate,
        },
      });
      setAvailableSlots(res.data.availableSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async () => {
    setErrorMessage("");
    if (!selectedEntity || !selectedDate || !selectedSlot) {
      alert("Please select all options before booking.");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:6987/api/book`, {
        userId,
        carId: car._id,
        entityId: selectedEntity.value,
        entityType: selectedEntity.type,
        date: selectedDate,
        slot: selectedSlot,
      });

      alert("Slot booked successfully!");
      onClose(); // Close modal
    } catch (error) {
        let message = "An unexpected error occurred. Please try again.";
    
        if (error.response && error.response.data.message) {
          message = error.response.data.message;
        }
    
        setErrorMessage(message); // Show inside modal
        alert(`❌ ${message}`); // Show browser alert
        onClose()
      }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-gray-800">Book Test Drive</h2>

        {/* Select Dealer or Outlet */}
        <label className="block mt-4">Choose Dealer/Outlet:</label>
        <select
          className="w-full mt-2 p-2 border rounded"
          onChange={(e) => {
            const selected = JSON.parse(e.target.value);
            setSelectedEntity(selected);
          }}
        >
          <option value="">Select</option>
          {car.dealers.map((dealer) => (
            <option key={dealer.id} value={JSON.stringify({ value: dealer.id, type: "Dealer" })}>
              {dealer.name} (Dealer)
            </option>
          ))}
          {car.outlets.map((outlet) => (
            <option key={outlet.id} value={JSON.stringify({ value: outlet.id, type: "Outlet" })}>
              {outlet.name} (Outlet)
            </option>
          ))}
        </select>

        {/* Select Date */}
        <label className="block mt-4">Choose Date:</label>
        <input
          type="date"
          className="w-full mt-2 p-2 border rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {/* Available Slots */}
        <label className="block mt-4">Available Slots:</label>
        {loadingSlots ? (
          <p>Loading slots...</p>
        ) : availableSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                className={`p-2 border rounded text-center ${selectedSlot === slot ? "bg-green-500 text-white" : "bg-gray-100"}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <p>No slots available</p>
        )}

        {/* Confirm Booking Button */}
        <button
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleBooking}
        >
          Confirm Booking
        </button>

        {/* Close Button */}
        <button className="mt-2 text-gray-500" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
