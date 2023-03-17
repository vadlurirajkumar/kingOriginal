const PrivacyModel = require("../model/privacyPolicyModel")


// add new privacy policy
const addPrivacy = async (req, res) => {
    try {
      const privacy = new PrivacyModel({
        topHead: req.body.topHead,
        topPara: req.body.topPara,
        bottomHead: req.body.bottomHead,
        bottomPara: req.body.bottomPara,
      });
  
      await privacy.save();
  
      res.status(200).json({
        status: true,
        message: "Privacy policy added successfully",
        response: [privacy],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Error in adding privacy policy",
        response: [],
      });
    }
  };

// update new privacy policy
const updatePrivacy = async (req, res) => {
    try {
      // Retrieve the existing privacy document
      const privacy = await PrivacyModel.findOne();
  
      // Update the fields that are present in the request body
      if (req.body.topHead) {
        privacy.topHead = req.body.topHead;
      }
      if (req.body.topPara) {
        privacy.topPara = req.body.topPara;
      }
      if (req.body.bottomHead) {
        privacy.bottomHead = req.body.bottomHead;
      }
      if (req.body.bottomPara) {
        privacy.bottomPara = req.body.bottomPara;
      }
  
      // Save the updated privacy document
      await privacy.save();
  
      // Return the updated privacy document as response
      res.status(200).json({
        status: true,
        message: "Privacy policy updated successfully",
        response: [privacy],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Error in updating privacy policy",
        response: [],
      });
    }
  };

  // delete privacy policy
  const deletePrivacy = async (req, res) => {
    try {
      const privacyId = req.params.id;
      const deletedPrivacy = await PrivacyModel.findByIdAndDelete(privacyId);
      
      if (!deletedPrivacy) {
        return res.status(404).json({
          status: false,
          message: "Privacy policy not found",
          response: [],
        });
      }
  
      res.status(200).json({
        status: true,
        message: "Privacy policy deleted successfully",
        response: [deletedPrivacy],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Error in deleting privacy policy",
        response: [],
      });
    }
  };
  
  // get privacy-policy
  const getPrivacy = async (req, res) => {
    try {
      const privacyPolicies = await PrivacyModel.find();
  
      if (!privacyPolicies) {
        return res.status(404).json({
          status: false,
          message: "No privacy policies found",
          response: [],
        });
      }
  
      res.status(200).json({
        status: true,
        message: "Privacy policies retrieved successfully",
        response: privacyPolicies,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Error in retrieving privacy policies",
        response: [],
      });
    }
  };
  

  module.exports = {addPrivacy, updatePrivacy, deletePrivacy, getPrivacy}