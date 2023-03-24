const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    formName: {
      type: String,
      required: true,
    },
    formEmail:{
        type: String,
        required: true,  
    },
    formPhoneNo:{
        type: String,
      required: true,
    },
    formMessage:{
        type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const ContactUs = new mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;
