const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    aboutUsData: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const AboutUs = new mongoose.model("AboutUs", aboutUsSchema);

module.exports = AboutUs;
