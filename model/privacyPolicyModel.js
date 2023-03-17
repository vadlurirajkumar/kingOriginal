const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema(
  {
    privacyData: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Privacy = new mongoose.model("Privacy", privacySchema);

module.exports = Privacy;
