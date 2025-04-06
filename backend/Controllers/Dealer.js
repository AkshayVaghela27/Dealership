const Dealer = require("../Models/Dealer");
const DealerRequest = require("../Models/DealerRequest");
const Brand = require("../Models/Brand")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OutletRequest = require("../Models/OutletRequest");
const Outlet = require("../Models/Outlet");
const DealerInventory = require("../Models/DealerInventory");
const BrandInventory = require("../Models/BrandInventory");
const nodemailer = require("nodemailer");
const multer = require("multer");
require("dotenv").config();

const requestDealership = async (req, res) => {
  try {
    const { name, email, phone, address, brandId, aadhar, pan } = req.body;

    if (!brandId) return res.status(400).json({ error: "Brand ID is required." });

    if (!aadhar || !pan) return res.status(400).json({ error: "Aadhar and PAN image URLs are required." });

    const brandExists = await Brand.findById(brandId);
    if (!brandExists) return res.status(404).json({ error: "Brand not found." });

    const existingRequest = await DealerRequest.findOne({ email });
    if (existingRequest) return res.status(400).json({ error: "Request already exists." });

    const newRequest = new DealerRequest({
      name,
      email,
      phone,
      address,
      brand: brandId,
      aadhar,  // Store URL directly
      pan,     // Store URL directly
      status: "pending",
      aadharStatus: "pending",
      panStatus: "pending",
    });

    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// ✅ Dealer Login
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const dealer = await Dealer.findOne({ email });

//     if (!dealer || !(await bcrypt.compare(password, dealer.password))) {
//       return res.status(401).json({ msg: "Invalid email or password." });
//     }

//     const token = jwt.sign({ _id: dealer._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
//     res.cookie("token", token);
//     res.status(200).json({ msg: "Login successful", dealerId: dealer._id });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// ✅ Get Dealer Profile
// const getProfile = async (req, res) => {
//   try {
//     console.log('Dealer:', req.dealer); // Log the dealer object

//     if (!req.dealer) {
//       return res.status(404).json({ msg: "Dealer not found" });
//     }

//     // Send the dealer data back as a response
//     const dealer  = await Dealer.findById(req.dealer._id).populate("brand");
//     res.json({dealer});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// }

const getDealerById = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id).populate("brand").populate("outlets");
    if (!dealer) {
      return res.status(404).json({ error: "Dealer not found" });
    }
    res.json(dealer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getallDealer = async(req,res) => {
    try{
      const dealer = await Dealer.find().populate("brand")
      res.json(dealer)
    }catch(err){
      console.log(err)
    }
}


const deleteDealer = async (req, res) => {
  try {
    const { dealerId } = req.params;

    // 🔹 Find and delete the dealer (Triggers middleware)
    const deletedDealer = await Dealer.findByIdAndDelete(dealerId);

    if (!deletedDealer) {
      return res.status(404).json({ message: "Dealer not found." });
    }

    res.json({ message: "Dealer deleted successfully." });
  } catch (error) {
    console.error("Error deleting dealer:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Dealer Password
const updateDealerPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // ✅ Get dealer ID from authenticated user (req.user)
    const dealerId = req.user._id;

    // ✅ Step 1: Find the dealer by ID
    const dealer = await Dealer.findById(dealerId);
    if (!dealer) {
      return res.status(404).json({ error: "User not found." });
    }

    // ✅ Step 2: Verify the current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, dealer.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    // ✅ Step 3: Validate the new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long." });
    }

    // ✅ Step 4: Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Step 5: Update and save the dealer’s password
    dealer.password = hashedNewPassword;
    await dealer.save();

    // ✅ Step 6: Respond with a success message
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating dealer password:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = updateDealerPassword;

const getOutletRequest = async (req, res) => {  
  try{
      const requests = await OutletRequest.find({dealer:req.params.id, status:"pending"});
      res.json(requests);    
  }catch (error) {
    console.error("Error fetching outlet requests:", error);
    res.status(500).json({ error: "Server error" });
  }
}

const verifyDocs = async (req, res) => {
    try {
      const { requestId, aadharStatus, panStatus } = req.body;
  
      // 🔹 Find the request
      const request = await OutletRequest.findById(requestId);
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
  

const handleOutletRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const request = await OutletRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }
    if(action === 'approved'){
       request.status = 'approved'

       const existingOutlet = await Outlet.findOne({email : request.email})
       if(existingOutlet){
         return res.status(400).json({error: "Outlet with this email already exists."})
       }

      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const newOutlet = await Outlet.create({
        name: request.name,
        email: request.email,
        password: hashedPassword,
        phone: request.phone,
        address: request.address,
        dealer: request.dealer
      })

      const dealer = await Dealer.findById(request.dealer)
      if(!dealer){
        return res.status(404).json({error: "Dealer not found."})
      } 
      dealer.outlets.push(newOutlet)
      await dealer.save()

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
                from: `"${dealer.name}" <${process.env.SMTP_USER}>`,
                to: request.email,
        subject: 'Outlet Request Approved',
        text: `Hello ${request.name},\n\nYour outlet request has been approved! 🎉\n\nHere are your login credentials:\nEmail: ${request.email}\nTemporary Password: ${tempPassword}\n\nPlease log in and change your password immediately.\n\nBest regards,\n${dealer.name}`,
      };
      await transporter.sendMail(mailOptions);

    } 
    else if(action === 'rejected'){
      request.status = 'rejected'
    } 
    request.save()
    
    if(action === 'approved'){
        const deleteoutletRequest = await OutletRequest.findByIdAndDelete(requestId)
        if(!deleteoutletRequest){
          return res.status(404).json({message: "Failed to delete the request after approval."})
        }
    }

    res.json({message: `Request ${action}d successfully.`})

  }catch(err){
    console.log(err)
    res.status(500).json({ error: error.message });
  }
}

const deleteDealerInventory = async (req, res) => {
  try {
  
      const { dealerInventoryId } = req.params;

      if (!dealerInventoryId) {
          return res.status(400).json({ message: "Missing dealerInventoryId in request parameters." });
      }

      const deletedDealerInventory = await DealerInventory.findByIdAndDelete(dealerInventoryId);

      if (!deletedDealerInventory) {
          return res.status(404).json({ message: "Dealer Inventory not found." });
      }

      res.json({ message: "Dealer Inventory deleted successfully." });

  } catch (error) {
      console.error("❌ Error deleting Dealer Inventory:", error);
      res.status(500).json({ error: error.message });
  }
};


module.exports = { requestDealership, getDealerById, getallDealer ,deleteDealer,updateDealerPassword,getOutletRequest,verifyDocs,handleOutletRequest,deleteDealerInventory};
