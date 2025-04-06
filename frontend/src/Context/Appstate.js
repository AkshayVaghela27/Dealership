import AppContext from "./AppContext";
import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true; // Ensures cookies are sent with requests

const Appstate = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Check authentication when the app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:6987/api/auth/me");
        
        if (response.data.userId) {
          const profileResponse = await axios.get("http://localhost:6987/api/profile");
          setUser(profileResponse.data); // ✅ Ensure complete profile data is set
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ✅ Register Function
  const register = async (name, logo, phone, email, address, password) => {
    try {
      const response = await axios.post("http://localhost:6987/api/brands/register", 
        { name, logo, phone, email, address, password },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      throw err;
    }
  };
 // ✅ UserRegister Function
  const UserRegister = async (name,email,password,phone,address) => {   
      try{
        const response = await axios.post("http://localhost:6987/api/user/register",
        {name,email,password,phone,address},
        {headers : {"Content-Type" : "application/json"}}
      )
      return response.data;
      }catch(err) {
        console.error("Registration error:", err.response?.data || err.message);
      }
  }

  // ✅ Login Function
  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:6987/api/login", { email, password });

      // ✅ Fetch complete user profile after login
      const profileResponse = await axios.get("http://localhost:6987/api/profile");
      setUser(profileResponse.data);

      // Redirect to respective dashboard
      if (response.data.role === "brand") navigate(`/brand-dashboard/${response.data.userId}`);
      else if (response.data.role === "dealer") navigate(`/dealer-dashboard/${response.data.userId}`);
      else if (response.data.role === "outlet") navigate(`/outlet-dashboard/${response.data.userId}`);
      else if (response.data.role === "customer") navigate(`/user-dashboard/${response.data.userId}`);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Invalid email or password");
    }
  };

  // ✅ Logout Function
  const logout = async () => {
    try {
      await axios.post("http://localhost:6987/api/logout");
      setUser(null);
      navigate("/"); 
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  return (
    <AppContext.Provider value={{ register,UserRegister, login, logout, user, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export default Appstate;
