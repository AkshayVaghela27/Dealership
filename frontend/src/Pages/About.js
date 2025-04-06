import { motion } from "framer-motion";
import WallImage from "../Images/Wall.jpg"
import { useNavigate } from "react-router-dom";

const About = () => {

    const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-gray-900 text-white p-10">
      <div
  style={{ backgroundImage: `url(${WallImage})` }}
  className="absolute inset-0 bg-cover bg-center opacity-20 blur-2xl"
></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative max-w-4xl mx-auto text-center p-10 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg"
      >
        <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-lg"> Driving Innovation in Automotive Dealerships</h1>
        <p className="mt-5 text-lg text-gray-300">Revolutionizing the automobile dealership industry with seamless inventory management and automated approvals.</p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {["Hierarchical Inventory Management", "Seamless Dealership & Outlet Requests", "Automated Approval Process", "Secure & Scalable"].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="p-6 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg hover:scale-105 transition-transform"
          >
            <h2 className="text-xl font-semibold text-cyan-300">{feature}</h2>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-12 flex justify-center relative z-10"
      >
        <button onClick={() => navigate("/") } className="px-6 py-3 text-lg font-bold text-white bg-cyan-500 rounded-full shadow-lg transition-all hover:bg-cyan-400 hover:shadow-cyan-400/50">
          Join Us Now
        </button>
      </motion.div>
    </div>
  );
};

export default About;
