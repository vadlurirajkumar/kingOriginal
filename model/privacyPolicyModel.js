const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema(
  {
    topHead: {
      type: String,
      required: true,
    },
    topPara: {
      type: String,
      required: true,
    },
    bottomHead: {
      type: String,
      required: true,
    },
    bottomPara: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Privacy = new mongoose.model("Privacy", privacySchema);

module.exports = Privacy;
