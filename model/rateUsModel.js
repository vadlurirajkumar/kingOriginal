const mongoose = require("mongoose");

const rateUsSchema = new mongoose.Schema(
  {
    rating: {
      type: String,
      required: true,
    },
    userId:{
        type: String
    },
    userName:{
        type: String
    }
  },
);

const RateUs = new mongoose.model("RateUs", rateUsSchema);

module.exports = RateUs;
