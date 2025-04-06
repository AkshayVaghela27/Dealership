import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      {/* 🔹 Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-extrabold mb-6"
        >
          Revolutionizing Dealership Management
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg text-gray-300 max-w-2xl"
        >
          Effortlessly connect **brands, dealers, and outlets** to streamline inventory, approvals, and sales.  
          Your one-stop solution for modern dealership management.
        </motion.p>

        <motion.img 
          src="https://cdn.pixabay.com/photo/2021/07/08/14/51/car-6396766_960_720.png" 
          alt="Car Illustration"
          className="w-96 mt-8 drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 flex gap-5"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition shadow-lg"
            onClick={() => navigate("/login")}
          >
            Get Started 🚀
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition shadow-lg"
            onClick={() => navigate("/brand")}
          >
            Request Dealership 🏢
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-lg text-lg font-semibold transition shadow-lg"
            onClick={() => navigate("/dealer")}
          >
            Request Outlet 🏬
          </motion.button>
        </motion.div>
      </section>

      {/* 🔹 Customer Signup Section */}
      <section className="bg-gray-900 py-12 px-6">
  <motion.h2
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-4xl font-bold text-center mb-6"
  >
    Join Us as a Customer 🚗
  </motion.h2>

  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.8 }}
    className="text-lg text-gray-600 text-center max-w-xl mx-auto"
  >
    Unlock exclusive deals, browse dealerships, and experience seamless car servicing.  
    Sign up today and get started with your journey!
  </motion.p>

  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
    className="mt-8 flex justify-center"
  >
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition shadow-lg"
      onClick={() => navigate("/user-signup")}
    >
      Sign Up Now ✨
    </motion.button>
  </motion.div>
</section>


      {/* 🔹 Features Section */}
      <section className="bg-gray-900 py-12 px-6">
        <h2 className="text-4xl font-bold text-center mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            { title: "Fast Approvals", desc: "Get dealership approvals within days, not weeks!", icon: "⚡" },
            { title: "Real-time Inventory", desc: "Track vehicle availability across all outlets.", icon: "📦" },
            { title: "Easy Management", desc: "Centralized dashboard for dealers and brands.", icon: "🖥️" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg text-center shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.2, duration: 0.7 }}
            >
              <span className="text-5xl">{feature.icon}</span>
              <h3 className="text-2xl font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-400 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
