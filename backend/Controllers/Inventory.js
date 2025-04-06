const CarModel = require("../Models/CarModels");
const BrandInventory = require("../Models/BrandInventory");
const Brand = require("../Models/Brand");
const mongoose = require("mongoose");
const DealerInventory = require("../Models/DealerInventory");
const OutletInventory = require("../Models/OutletInventory");
const Dealer = require("../Models/Dealer");
const Outlet = require("../Models/Outlet");

const addCarWithStock = async (req, res) => {
  try {
    const { name, brandId, price, specifications, image, quantity } = req.body;

    // Check if all required fields are provided
    if (!name || !brandId || !price || !specifications || !image || quantity === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the brand exists
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Check if the car model already exists under this brand
    let carModel = await CarModel.findOne({ name, brand: brandId });

    if (!carModel) {
      // Step 1: Create a new Car Model if it does not exist
      carModel = new CarModel({
        name,
        brand: brandId,
        price,
        specifications,
        image,
      });

      await carModel.save();

      // Step 2: Add the Car Model ID to Brand Schema
      await Brand.findByIdAndUpdate(
        brandId,
        { $addToSet: { carModels: carModel._id } }, // Ensures no duplicate IDs
        { new: true }
      );
    } else {
      // Step 3: Update existing Car Model details
      carModel.price = price;
      carModel.specifications = specifications;
      carModel.image = image;
      await carModel.save();
    }

    // Step 4: Check if the car already exists in Brand Inventory
    let brandInventory = await BrandInventory.findOne({
      brand: brandId,
      carModel: carModel._id,
    });

    if (brandInventory) {
      // If the car model exists, update the quantity
      brandInventory.quantity += quantity;
      await brandInventory.save();
    } else {
      // Otherwise, create a new inventory document
      brandInventory = new BrandInventory({
        brand: brandId,
        carModel: carModel._id,
        quantity,
      });

      await brandInventory.save();
    }

    return res.status(201).json({
      message: "Car added/updated successfully!",
      car: carModel,
      stock: brandInventory,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const deleteCarModel = async (req, res) => {
  try {
      const { carModel } = req.params;

      // 🔹 Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(carModel)) {
          return res.status(400).json({ message: "Invalid carModel ID format" });
      }

      // 🔍 Check if the CarModel exists in CarModel schema
      const carModelExists = await CarModel.findById(carModel);
      if (!carModelExists) {
          return res.status(404).json({ message: "Car Model not found in CarModel collection" });
      }

      // 🚨 Remove CarModel from Brand's `carModels` array
      await Brand.updateMany(
          { carModels: carModel },
          { $pull: { carModels: carModel } }
      );

      // 🚨 Remove CarModel from Dealer's `inventory` array
      await Dealer.updateMany(
          { "inventory.carModel": carModel },
          { $pull: { inventory: { carModel: carModel } } }
      );

      // 🚨 Remove CarModel from Outlet's `inventory` array
      await Outlet.updateMany(
          { "inventory.carModel": carModel },
          { $pull: { inventory: { carModel: carModel } } }
      );

      // 🗑️ Delete CarModel from BrandInventory
      await BrandInventory.deleteOne({ carModel: carModel });

      // 🗑️ Delete CarModel from DealerInventory
      await DealerInventory.deleteMany({ carModel: carModel });

      // 🗑️ Delete CarModel from OutletInventory
      await OutletInventory.deleteMany({ carModel: carModel });

      // 🗑️ Finally, Delete CarModel from CarModel Schema
      await CarModel.findByIdAndDelete(carModel);

      res.status(200).json({ message: "Car Model deleted successfully from all collections" });

  } catch (error) {
      console.error("❌ Error Deleting Car Model:", error);
      res.status(500).json({ message: "Server error" });
  }
};

const carmodelbyBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    // 🔹 Find car models of the given brand
    const cars = await CarModel.find({ brand: brandId })
      .populate("brand") // ✅ Get brand details
      .lean(); // Convert to plain JavaScript objects for easy manipulation

    // 🔹 Find inventory data for these car models
    const carModelIds = cars.map((car) => car._id);

    const inventories = await BrandInventory.find({ carModel: { $in: carModelIds } })
      .select("carModel quantity") // ✅ Only fetch carModel & quantity
      .lean();

    // 🔹 Create a map of { carModelId: quantity }
    const inventoryMap = {};
    inventories.forEach((inv) => {
      inventoryMap[inv.carModel.toString()] = inv.quantity;
    });

    // 🔹 Merge quantity into car models
    const carsWithQuantity = cars.map((car) => ({
      ...car,
      quantity: inventoryMap[car._id.toString()] || 0, // Default to 0 if not found
    }));

    res.status(200).json(carsWithQuantity);
  } catch (error) {
    console.error("Error fetching Car Models:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const carmodelbyDealer = async (req, res) => {
  try {
    const { dealerId } = req.params;

    // Check if dealer exists and get its brand
    const dealer = await Dealer.findById(dealerId).select("brand").lean();
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    // Fetch dealer inventory with car models and quantities
    const dealerInventories = await DealerInventory.find({ dealer: dealerId })
      .populate("carModel", "name price image specifications")
      .select("carModel quantity")
      .lean()
      .exec();

    // Fetch car models that belong to the same brand but are not assigned to any dealer
    const brandCarModels = await CarModel.find({
      brand: dealer.brand, // Only fetch car models from the same brand
      _id: { $nin: dealerInventories.map((inv) => inv.carModel._id) }, // Exclude cars already in dealer inventory
    })
      .select("name price image specifications brand")
      .lean()
      .exec();

    // Format dealer inventory response
    const dealerCars = dealerInventories.map((inventory) => ({
      _id: inventory.carModel._id,
      name: inventory.carModel.name,
      price: inventory.carModel.price,
      image: inventory.carModel.image,
      specifications: inventory.carModel.specifications,
      quantity: inventory.quantity, // Include quantity from inventory
    }));

    // Format brand car models response (without quantity)
    const brandCars = brandCarModels.map((car) => ({
      _id: car._id,
      name: car.name,
      price: car.price,
      image: car.image,
      specifications: car.specifications,
      quantity: 0, // Since it's not assigned to a dealer, quantity is 0
    }));

    // Combine both lists
    const response = [...dealerCars, ...brandCars];

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching Car Models:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const carmodelbyOutlet = async (req, res) => {
  try {
    const { outletId } = req.params;

    // Find the outlet and get the dealer it is associated with
    const outlet = await Outlet.findById(outletId).select("dealer").lean();
    if (!outlet) {
      return res.status(404).json({ message: "Outlet not found" });
    }

    // Find the dealer of this outlet
    const dealer = await Dealer.findById(outlet.dealer).select("brand").lean();
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    // Fetch outlet inventory (cars the outlet already has)
    const outletInventories = await OutletInventory.find({ outlet: outletId })
      .populate("carModel", "name price image specifications")
      .select("carModel quantity")
      .lean();

    // Fetch car models available in the dealer's inventory but not in the outlet
    const dealerInventories = await DealerInventory.find({ dealer: outlet.dealer })
      .populate("carModel", "name price image specifications")
      .select("carModel quantity")
      .lean();

    // Find cars that are available in the dealer but not in the outlet
    const unassignedCars = dealerInventories
      .filter(
        (dealerCar) =>
          !outletInventories.some((outletCar) => 
            String(outletCar.carModel._id) === String(dealerCar.carModel._id)
          )
      )
      .map((car) => ({
        _id: car.carModel._id,
        name: car.carModel.name,
        price: car.carModel.price,
        image: car.carModel.image,
        specifications: car.carModel.specifications,
        quantity: 0, // Not in outlet, so quantity is 0
      }));

    // Format outlet inventory response
    const outletCars = outletInventories.map((inventory) => ({
      _id: inventory.carModel._id,
      name: inventory.carModel.name,
      price: inventory.carModel.price,
      image: inventory.carModel.image,
      specifications: inventory.carModel.specifications,
      quantity: inventory.quantity, // Include quantity from inventory
    }));

    // Combine assigned and unassigned cars
    const response = [...outletCars, ...unassignedCars];

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching Car Models for Outlet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { addCarWithStock , deleteCarModel , carmodelbyBrand , carmodelbyDealer , carmodelbyOutlet};
