const AboutUsModel = require("../model/aboutUsModel")


// add new about us data
const addAboutUs = async (req, res) => {
    try {
      const AboutUs = new AboutUsModel({
        aboutUsData: req.body.aboutUsData
      });
  
      await AboutUs.save();
  
      res.status(200).json({
        status: true,
        message: "AboutUs data added successfully",
        response: [AboutUs],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Error in adding AboutUs data",
        response: [],
      });
    }
  };

// update new AboutUs data
const updateAboutUs = async (req, res) => {
    try {
      // Retrieve the existing AboutUs document
      const AboutUs = await AboutUsModel.findOne();
  
      // Update the fields that are present in the request body
      if (req.body.aboutUsData) {
        AboutUs.aboutUsData = req.body.aboutUsData;
      }
      // Save the updated AboutUs document
      await AboutUs.save();
  
      // Return the updated AboutUs document as response
      res.status(200).json({
        status: true,
        message: "AboutUs data updated successfully",
        response: [AboutUs],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Error in updating AboutUs data",
        response: [],
      });
    }
  };

  // delete AboutUs data
  const deleteAboutUs = async (req, res) => {
    try {
      const AboutUsId = req.params.id;
      const deletedAboutUs = await AboutUsModel.findByIdAndDelete(AboutUsId);
      
      if (!deletedAboutUs) {
        return res.status(404).json({
          status: false,
          message: "AboutUs data not found",
          response: [],
        });
      }
  
      res.status(200).json({
        status: true,
        message: "AboutUs data deleted successfully",
        response: [deletedAboutUs],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Error in deleting AboutUs data",
        response: [],
      });
    }
  };
  
  // get AboutUs-data
  const getAboutUs = async (req, res) => {
    try {
      const AboutUsPolicies = await AboutUsModel.find();
  
      if (!AboutUsPolicies) {
        return res.status(404).json({
          status: false,
          message: "No AboutUs policies found",
          response: [],
        });
      }
  
      res.status(200).json({
        status: true,
        message: "AboutUs policies retrieved successfully",
        response: AboutUsPolicies,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Error in retrieving AboutUs policies",
        response: [],
      });
    }
  };
  

  module.exports = {addAboutUs, updateAboutUs, deleteAboutUs, getAboutUs}