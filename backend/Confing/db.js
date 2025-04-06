const mongoose = require("mongoose")
require("dotenv").config()

const connectdb = async() => {
    try {
        await mongoose.connect(process.env.MongoUrl,{
            dbName:"Dealer_Management"
        })
    console.log("Mongodb connect")
}
catch(err)  {
    console.log(err)
}
}

module.exports = connectdb