const mongoose = require("mongoose");

const contactUsDeliveryBoySchema = new mongoose.Schema(
  {
    deliveryBoyId:String,
    deliveryBoyName:String,
    deliveryBoyMobile:String,
    deliveryBoyMessage:String
  },
  { timestamps: true }
);

const ContactUsDeliveryBoy = new mongoose.model("ContactUsDeliveryBoy", contactUsDeliveryBoySchema);

module.exports = ContactUsDeliveryBoy;
