import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppContext from "../Context/AppContext";
import UpdatePassword from "./UpdatePassword";

const Profile = () => {
  const { user, logout, loading } = useContext(AppContext);
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">User not found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-center mt-4">{user.name || "No Name"}</h2>
        <p className="text-gray-600 text-center">{user.role?.toUpperCase() || "No Role"}</p>

        <div className="mt-4 space-y-2">
          <p><strong>Email:</strong> {user.email || "No Email"}</p>
          <p><strong>Phone:</strong> {user.phone || "No Phone"}</p>
          <p><strong>Address:</strong> {user.address || "No Address"}</p>
        </div>

        {(user.role === "dealer" || user.role === "outlet" || user.role === "customer") && (
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
          >
            {showPasswordForm ? "Cancel" : "Update Password"}
          </button>
        )}

        {showPasswordForm && (
          <UpdatePassword userId={user._id} role={user.role} onClose={() => setShowPasswordForm(false)} />
        )}

        <button 
          onClick={logout} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
