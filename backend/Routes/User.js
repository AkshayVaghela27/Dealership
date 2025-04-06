const express = require("express")
const router = express.Router()
const {register,updatePassword} = require("../Controllers/User")
const auth = require("../Middleware/Auth")

router.post("/register",register)

router.put("/update-password",auth,updatePassword)

module.exports = router