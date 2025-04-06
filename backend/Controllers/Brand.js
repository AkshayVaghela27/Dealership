  const Brand = require("../Models/Brand");
  const DealerRequest = require("../Models/DealerRequest");
  const Dealer = require("../Models/Dealer"); 
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const nodemailer = require("nodemailer");
  require("dotenv").config();

  // ✅ Register Brand
    const register = async (req, res) => {
      try {
        const { name, logo, phone, email, address, password } = req.body;

        // Ensure all required fields exist
        if (!name || !logo || !phone || !email || !address || !password) {
          return res.status(400).json({ message: "All fields are required." });
        }

        // Construct the correct structure expected by Mongoose schema
        let newBrand = new Brand({
          name,
          logo,
          contactInfo: {
            phone,
            email,
            address,
          },
          password,
        });

        const haspass = await bcrypt.hash(password,10)

        newBrand = await Brand.create({name,logo,contactInfo:{phone,email,address},password:haspass})
        res.status(201).json({ message: "Brand registered successfully!" });
      } catch (error) {
        console.error("Error registering brand:", error);
        res.status(500).json({ message: "Failed to register brand." });
      }
    };


  // ✅ Brand Login
  // const login = async (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  //     const brand = await Brand.findOne({ "contactInfo.email": email });

  //     if (!brand || !(await bcrypt.compare(password, brand.password))) {
  //       return res.status(401).json({ message: "Invalid email or password." });
  //     }

  //     const token = jwt.sign({ _id: brand._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  //     res.cookie("token", token);
  //     res.status(200).json({ message: "Login successful", brandId: brand._id });

  //   } catch (error) {
  //     res.status(500).json({ error: "Server error" });
  //   }
  // };

  // ✅ Get Brand Profile
  // const getProfile = async (req, res) => {
  //   try {
  //     const brand = req.brand;
  //     res.json(brand);
  //   } catch (error) {
  //     res.status(500).json({ error: "Server error" });
  //   }
  // };

  const getBrandById = async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id).populate("dealers");
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };

  // ✅ Get Pending Dealership Requests
  const getDealershipRequests = async (req, res) => {
    try {
      const requests = await DealerRequest.find({ brand: req.params.id, status: "pending" });
      res.json(requests);
    } catch (error) {
      console.error("Error fetching dealership requests:", error);
      res.status(500).json({ error: "Server error" });
    }
  };


  // Get All Brand

  const getallBrand = async(req,res) => {
    try{
      const brand = await Brand.find()
      res.json(brand)
    }catch(err){
      console.log(err)
    }
  }
//Verify Docs
  const verifyDocs = async (req, res) => {
    try {
      const { requestId, aadharStatus, panStatus } = req.body;
  
      // 🔹 Find the request
      const request = await DealerRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found." });
      }
  
      // 🔹 Update Aadhar & PAN status
      if (aadharStatus) request.aadharStatus = aadharStatus;
      if (panStatus) request.panStatus = panStatus;
  
      await request.save();
  
      res.json({ message: "Aadhar & PAN status updated successfully." });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  // ✅ Handle Dealership Request (Approve/Reject)
  const handleDealershipRequest = async (req, res) => {
    try {
      const { requestId, action } = req.body;
  
      // 🔹 Find the dealership request
      const request = await DealerRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found." });
      }
  
      if (action === "approved") {

        if (request.aadharStatus !== "approved" || request.panStatus !== "approved") {
          return res.status(400).json({ error: "Aadhar & PAN must be approved first." });
        }
        
        request.status = "approved";
  
        // 🔹 Check if dealer already exists
        const existingDealer = await Dealer.findOne({ email: request.email });
        if (existingDealer) {
          return res.status(400).json({ error: "Dealer with this email already exists." });
        }
  
        // 🔹 Generate temp password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
        // 🔹 Create new dealer
        const newDealer = await Dealer.create({
          name: request.name,
          email: request.email,
          password: hashedPassword,
          phone: request.phone,
          address: request.address,
          brand: request.brand,
        });
  
        // 🔹 Find the brand and update its dealers list
        const brand = await Brand.findById(request.brand);
        if (!brand) {
          return res.status(404).json({ message: "Brand not found." });
        }
  
        brand.dealers.push(newDealer);
        await brand.save();
  
        // 🔹 Send email notification
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
  
        const mailOptions = {
          from: `"${brand.name}" <${process.env.SMTP_USER}>`,
          to: request.email,
          subject: "Your Dealership Account Credentials",
          text: `Hello ${request.name},\n\nYour dealership request has been approved! 🎉\n\nHere are your login credentials:\nEmail: ${request.email}\nTemporary Password: ${tempPassword}\n\nPlease log in and change your password immediately.\n\nBest regards,\n${brand.name}`,
        };
  
        await transporter.sendMail(mailOptions);
      } else if (action === "rejected") {
        request.status = "rejected";
      }
  
      // ✅ Save request status change BEFORE deletion
      await request.save();
  
      // ✅ Now delete request ONLY AFTER everything else is done
      if (action === "approved") {
        const deletedRequest = await DealerRequest.findByIdAndDelete(requestId);
        if (!deletedRequest) {
          return res.status(404).json({ message: "Failed to delete the request after approval." });
        }
      }
  
      res.json({ message: `Request ${action}d successfully.` });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


  module.exports = { register, getBrandById, getallBrand , getDealershipRequests, verifyDocs,handleDealershipRequest };
