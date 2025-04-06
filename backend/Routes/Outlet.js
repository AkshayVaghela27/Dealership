const express = require("express");
const router = express.Router();
const {
    requestOutlet,getOutletbyId,getallOutlet,deleteOutlet,updateOutletPassword,deleteOutletInventory
} = require("../Controllers/Outlet");

const auth = require("../Middleware/Auth");

router.post("/request", requestOutlet);

router.get("/getoutlet",getallOutlet)

router.get("/:id",getOutletbyId)

router.put("/updatepassword",auth,updateOutletPassword)

router.delete("/:outletId", deleteOutlet);

router.delete("/delete-inventory/:outletInventoryId", deleteOutletInventory);

module.exports = router;
