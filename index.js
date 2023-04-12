const express = require("express")
require("dotenv").config();
const cors = require("cors")
const cloudinary = require("cloudinary")
const port = process.env.PORT
const app = express()

// Db connection 
require("./conifg/dbFile")

// config cloudinary 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

// importing router files
const router = require("./routes/userRoute")
const adminRoute = require("./routes/adminRoute")
const categoryRoute = require("./routes/categoryRoute")
const productRoute = require("./routes/productRoute")
const cartRoute = require("./routes/cartRoute");
const dealsRoute = require("./routes/dealsRoute");
const policyRoute = require("./routes/privacypolicyRoute")
const aboutUsRoute = require("./routes/aboutusRoute")
const deliveryBoy = require("./routes/deliveryPersonRoute")
const contactUs = require("./routes/contactUsRoute")
const ratings = require("./routes/ratingRoute")
// middleware
app.use(express.json())
app.use(cors());

// admin& user routes
app.use("/user", router) // user route calling
app.use("/admin", adminRoute) // admin route calling
app.use("/category" , categoryRoute) // categories route calling
app.use("/product", productRoute) // products route calling
app.use("/cart", cartRoute) //cart route calling
app.use("/deals", dealsRoute) // deals route calling
app.use("/privacy-policy", policyRoute) // privacy policy route calling
app.use("/about-us", aboutUsRoute) // about us route calling
app.use("/delivery", deliveryBoy) //delivery person route calling
app.use("/feedback", contactUs) // contactUs route calling
app.use("/rating", ratings) // ratings route calling

// Port 
app.listen(port, ()=>{
    console.log(`port running at ${port}`)
})