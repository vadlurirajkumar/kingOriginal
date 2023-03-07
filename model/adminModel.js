const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const Category = require("../model/categoryModel")

const adminSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

//@ Generating Token
adminSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000,
  });
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
