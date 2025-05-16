import { useState, useEffect } from "react";
import axios from "axios";
import { FaChartBar } from "react-icons/fa";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ReportAnalysis = ({ brandId }) => {
  const [fuelTypeData, setFuelTypeData] = useState(null);
  const [carModelData, setCarModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const fuelTypeResponse = await axios.get(`http://localhost:6987/api/report/${brandId}/car-type`);
        const carModelResponse = await axios.get(`http://localhost:6987/api/report/${brandId}/car-model`);
        setFuelTypeData(fuelTypeResponse.data);
        setCarModelData(carModelResponse.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching report data.");
        setLoading(false);
      }
    };

    fetchReports();
  }, [brandId]);

  if (loading) return <p>Loading report data...</p>;
  if (error) return <p>{error}</p>;

  const fuelTypeChartData = {
    labels: fuelTypeData.map((item) => item._id),
    datasets: [
      {
        label: "Total Bookings",
        data: fuelTypeData.map((item) => item.totalBookings),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }
    ]
  };

  const carModelChartData = {
    labels: carModelData.map((item) => item._id),
    datasets: [
      {
        label: "Total Bookings",
        data: carModelData.map((item) => item.totalBookings),
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="mt-8 bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6 flex items-center">
        <FaChartBar className="mr-3 text-blue-600" size={24} />
        Report Analysis
      </h2>

      {/* Fuel Type Report */}
      <div className="bg-gray-50 p-6 rounded-lg shadow mb-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Fuel Type Overview</h3>
        <Line data={fuelTypeChartData} />

        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3 text-gray-600">Fuel Type Breakdown</h4>
          <ul className="divide-y divide-gray-200">
            {fuelTypeData.map((item, index) => (
              <li key={index} className="flex justify-between py-2 text-gray-700">
                <span>{item._id}</span>
                <span>{item.totalBookings} bookings</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Car Model Report */}
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Car Model Overview</h3>
        <Line data={carModelChartData} />

        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3 text-gray-600">Car Model Breakdown</h4>
          <ul className="divide-y divide-gray-200">
            {carModelData.map((item, index) => (
              <li key={index} className="flex justify-between py-2 text-gray-700">
                <span>{item._id}</span>
                <span>{item.totalBookings} bookings</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;
