const StockRequest = require("../Models/StockRequestSchema");
const DealerInventory = require("../Models/DealerInventory");
const OutletInventory = require("../Models/OutletInventory");
const BrandInventory = require("../Models/BrandInventory");
const Dealer = require("../Models/Dealer");
const Outlet = require("../Models/Outlet");
const Brand = require("../Models/Brand");

// 📌 1️⃣ Create Stock Request (Dealer → Brand OR Outlet → Dealer)
const requestStock = async (req, res) => {
  try {
    const { carModel, from, fromType, to, toType, quantity } = req.body;

    // Validate input
    if (!carModel || !from || !fromType || !to || !toType || !quantity) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure valid request type
    if (!(fromType === "Dealer" && toType === "Brand") && !(fromType === "Outlet" && toType === "Dealer")) {
      return res.status(400).json({ message: "Invalid stock request type." });
    }

    // Create a new stock request
    const newRequest = new StockRequest({ carModel, from, fromType, to, toType, quantity });
    await newRequest.save();

    return res.status(201).json({ message: "Stock request submitted successfully!", request: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const updateStockRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        // Validate status input
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Find stock request
        const stockRequest = await StockRequest.findById(requestId);
        if (!stockRequest) {
            return res.status(404).json({ message: "Stock request not found" });
        }

        // ❌ Prevent re-processing if the request is already approved or rejected
        if (stockRequest.status === "approved" || stockRequest.status === "rejected") {
            return res.status(400).json({ 
                message: `This stock request is already ${stockRequest.status} and cannot be reused.` 
            });
        }

        // ✅ If trying to approve, check stock availability
        if (status === "approved") {
            if (stockRequest.toType === "Brand" && stockRequest.fromType === "Dealer") {
                // 🔍 Check if the brand has enough stock
                const brandInventory = await BrandInventory.findOne({
                    brand: stockRequest.to,
                    carModel: stockRequest.carModel
                });

                if (!brandInventory || brandInventory.quantity < stockRequest.quantity) {
                    return res.status(400).json({
                        message: "Insufficient stock in Brand Inventory. Request remains pending."
                    });
                }

                // ✅ Deduct stock from Brand
                await BrandInventory.findOneAndUpdate(
                    { brand: stockRequest.to, carModel: stockRequest.carModel },
                    { $inc: { quantity: -stockRequest.quantity } }
                );

                await Brand.findOneAndUpdate({
                    
                })

                // ✅ Add stock to Dealer
                await DealerInventory.findOneAndUpdate(
                    { dealer: stockRequest.from, carModel: stockRequest.carModel },
                    { $inc: { quantity: stockRequest.quantity } },
                    { upsert: true, new: true }
                );

                // ✅ Update Dealer Inventory if model is not present
                await Dealer.findOneAndUpdate(
                    { _id: stockRequest.from, "inventory.carModel": { $ne: stockRequest.carModel } },
                    { $push: { inventory: { carModel: stockRequest.carModel, quantity: 0 } } },
                    { new: true }
                );

                await Dealer.findOneAndUpdate(
                    { _id: stockRequest.from, "inventory.carModel": stockRequest.carModel },
                    { $inc: { "inventory.$.quantity": stockRequest.quantity } },
                    { new: true }
                );

            } else if (stockRequest.toType === "Dealer" && stockRequest.fromType === "Outlet") {
                // 🔍 Check if the dealer has enough stock
                const dealerInventory = await DealerInventory.findOne({
                    dealer: stockRequest.to,
                    carModel: stockRequest.carModel
                });

                if (!dealerInventory || dealerInventory.quantity < stockRequest.quantity) {
                    return res.status(400).json({
                        message: "Insufficient stock in Dealer Inventory. Request remains pending."
                    });
                }

                // ✅ Deduct stock from Dealer
                await DealerInventory.findOneAndUpdate(
                    { dealer: stockRequest.to, carModel: stockRequest.carModel },
                    { $inc: { quantity: -stockRequest.quantity } }
                );

                // ✅ Add stock to Outlet
                await OutletInventory.findOneAndUpdate(
                    { outlet: stockRequest.from, carModel: stockRequest.carModel },
                    { $inc: { quantity: stockRequest.quantity } },
                    { upsert: true, new: true }
                );

                // ✅ Update Outlet Inventory if model is not present
                await Outlet.findOneAndUpdate(
                    { _id: stockRequest.from, "inventory.carModel": { $ne: stockRequest.carModel } },
                    { $push: { inventory: { carModel: stockRequest.carModel, quantity: 0 } } },
                    { new: true }
                );

                await Outlet.findOneAndUpdate(
                    { _id: stockRequest.from, "inventory.carModel": stockRequest.carModel },
                    { $inc: { "inventory.$.quantity": stockRequest.quantity } },
                    { new: true }
                );
            }
        }

        // ✅ Update stock request status
        stockRequest.status = status;
        await stockRequest.save();

        res.status(200).json({ message: `Stock request ${status} successfully` });

    } catch (error) {
        console.error("❌ Error Updating Stock Request:", error);
        res.status(500).json({ message: "Server error" });
    }
};
  

module.exports = {requestStock,updateStockRequest}