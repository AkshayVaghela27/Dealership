import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UpdatePassword = ({ userId, role }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        role === "dealer"
          ? "http://localhost:6987/api/dealers/updatepassword"
          : "http://localhost:6987/api/outlets/updatepassword";

      const response = await axios.put(
        endpoint,
        { userId, currentPassword, newPassword },
        { withCredentials: true }
      );

      toast.success(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-100 rounded">
      <label className="block text-gray-700">Current Password</label>
      <input
        type="password"
        className="w-full p-2 border border-gray-300 rounded mt-1"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />

      <label className="block text-gray-700 mt-3">New Password</label>
      <input
        type="password"
        className="w-full p-2 border border-gray-300 rounded mt-1"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        minLength={6}
      />

      <button
        type="submit"
        className="mt-3 bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default UpdatePassword;
