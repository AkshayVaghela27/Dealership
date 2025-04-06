const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {type: String,required: true,unique: true,trim: true,},
    logo: {type: String,required: true,},
    contactInfo: {
      phone: { type: String,required: true,},
      email: {type: String,required: true,unique: true },
      address: {type: String,required: true,},
    },
    password: {type: String,required: true,},
    role: { type: String, default: "brand" },
    carModels: [
      {type: mongoose.Schema.Types.ObjectId,ref: "CarModel",},
    ],
    dealershipRequests: [
      {type: mongoose.Schema.Types.ObjectId,ref: "DealerRequest",},
    ],
    dealers: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Dealer" // This will hold references to the associated dealers
      }
    ],
    createdAt: {type: Date,default: Date.now,},
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
