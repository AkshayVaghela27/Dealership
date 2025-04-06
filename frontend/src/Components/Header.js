import { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/AppContext"; // Import AppContext
import ThemeToggle from "../Pages/DarkModeToggle"; 

const Header = () => {
  const { user, logout } = useContext(AppContext); // Access user & logout function

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dealership Management</h1>
        <nav>
          <ul className="flex gap-4">
            <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
            <li><Link to="/about" className="hover:text-gray-200">About</Link></li>

            {/* Show Login & Signup ONLY if user is NOT logged in */}
            {!user && (
              <>
                <li><Link to="/login" className="hover:text-gray-200">Login</Link></li>
                <li><Link to="/brand-signup" className="hover:text-gray-200">Brand Sign Up</Link></li>
              </>
            )}

            {/* Show Profile & Logout ONLY if user is logged in */}
            {user && (
              <>
                <li><Link to={`/profile`} className="hover:text-gray-200">Profile</Link></li>
                <li><button onClick={logout} className="hover:text-gray-200">Logout</button></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
