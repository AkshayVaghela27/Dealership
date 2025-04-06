const CarModel = require("../Models/CarModels");
const Dealer = require("../Models/Dealer");
const Outlet = require("../Models/Outlet");

const getAllCarsWithDealersAndOutlets = async (req, res) => {
  try {
    const { search, brand, minPrice, maxPrice } = req.query;

    let filter = {};

    // Search by car name
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Filter by brand
    if (brand) {
      filter.brand = brand;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Fetch filtered cars
    const cars = await CarModel.find(filter).populate("brand");

    // Fetch dealers and outlets that have these cars in inventory
    const dealers = await Dealer.find({ "inventory.carModel": { $in: cars.map(car => car._id) } })
      .populate("brand")
      .populate("outlets");

    const outlets = await Outlet.find({ "inventory.carModel": { $in: cars.map(car => car._id) } })
      .populate("dealer");

    // Map car models to dealers & outlets that have them
    const carsWithDealersAndOutlets = cars.map((car) => {
      const carDealers = dealers.filter(dealer =>
        dealer.inventory.some(item => item.carModel.toString() === car._id.toString())
      );

      const carOutlets = outlets.filter(outlet =>
        outlet.inventory.some(item => item.carModel.toString() === car._id.toString())
      );

      return {
        ...car.toObject(),
        dealers: carDealers.map(dealer => ({
          id: dealer._id,
          name: dealer.name,
          address: dealer.address,
          brand: dealer.brand.name,
        })),
        outlets: carOutlets.map(outlet => ({
          id: outlet._id,
          name: outlet.name,
          address: outlet.address,
          dealer: outlet.dealer.name,
        })),
      };
    });

    res.json(carsWithDealersAndOutlets);
  } catch (error) {
    console.error("Error fetching cars with dealers and outlets:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const getCarDetails = async (req, res) => {
    try {
      const { carId } = req.params;
  
      const car = await CarModel.findById(carId).populate("brand");
  
      if (!car) return res.status(404).json({ error: "Car not found" });
  
      // Find dealers and outlets that have this car in inventory
      const dealers = await Dealer.find({ "inventory.carModel": carId }).populate("brand").populate("outlets");
      const outlets = await Outlet.find({ "inventory.carModel": carId }).populate("dealer");
  
      res.json({
        ...car.toObject(),
        dealers: dealers.map(dealer => ({
          id: dealer._id,
          name: dealer.name,
          address: dealer.address,
          brand: dealer.brand.name,
        })),
        outlets: outlets.map(outlet => ({
          id: outlet._id,
          name: outlet.name,
          address: outlet.address,
          dealer: outlet.dealer.name,
        })),
      });
    } catch (error) {
      console.error("Error fetching car details:", error);
      res.status(500).json({ error: "Failed to fetch car details" });
    }
  };
  
  module.exports = { getCarDetails };

module.exports = { getAllCarsWithDealersAndOutlets, getCarDetails };
