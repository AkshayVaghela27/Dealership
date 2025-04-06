const express = require("express");
const app = express();
const connectdb = require("./Confing/db");
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const Brand = require("./Models/Brand")
const mongoose = require("mongoose")
const userRoutes = require("./Routes/User")
const BrandRoutes = require("./Routes/Brand")
const DealerRoutes = require("./Routes/Dealer")
const OutletRoutes = require("./Routes/Outlet")
const login = require("./Routes/Login")
const Inventory = require("./Routes/Inventory")
const Stock = require("./Routes/Stock")
const Cars =require("./Routes/CarRoutes")
const TestDrive = require("./Routes/TestDrive")
const Slot = require("./Routes/Booking")
const port = process.env.PORT
connectdb()



app.use(cors({
  origin: "http://localhost:3000", // Only allow frontend origin
  credentials: true, // Allow cookies & authentication headers
})
);
app.use(express.json())
app.use(cookieParser())

app.use("/api",login)
app.use("/api/user",userRoutes)
app.use("/api/brands", BrandRoutes);
app.use("/api/dealers",DealerRoutes)
app.use("/api/outlets",OutletRoutes)
app.use("/api/inventory",Inventory)
app.use("/api/stock",Stock) 
app.use("/api",Cars)
// app.use("/api/test-drives",TestDrive)
app.use("/api",Slot)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
