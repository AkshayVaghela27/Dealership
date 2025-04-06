import { Routes, Route } from "react-router-dom";  
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

import LandingPage from "./Pages/Landingpage";
import ShowBrands from "./Pages/ShowBrands";
import ShowDealers from "./Pages/ShowDealers";
import Login from "./Pages/Login";
import BrandDashboard from "./Pages/BrandDashboard";
import DealerDashboard from "./Pages/DealerDashboard";
import OutletDashboard from "./Pages/OutletDashboard";
import UserDashboard from "./Pages/UserDashboard";
import About from "./Pages/About";
import Layout from "./Components/Layout";
import BrandSignup from "./Pages/BrandSignup";
import UserSignup from "./Pages/UserSingup"
import Profile from "./Pages/Profile";
import CarDetails from "./Pages/CarDetail";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ Add ToastContainer */}
      <Routes> 
        <Route path="login" element={<Login />} />
        <Route path="brand-signup" element={<BrandSignup />} />
        <Route path="user-signup" element={<UserSignup/>}/>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<About />} />
          <Route path="brand" element={<ShowBrands />} />
          <Route path="dealer" element={<ShowDealers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="brand-dashboard/:userId" element={<BrandDashboard />} />
          <Route path="dealer-dashboard/:userId" element={<DealerDashboard />} />
          <Route path="outlet-dashboard/:userId" element={<OutletDashboard />} />
          <Route path="user-dashboard/:userId" element={<UserDashboard/>} />
          <Route path="/cars/:carId" element={<CarDetails/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
