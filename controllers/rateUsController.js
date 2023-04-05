const RateUs = require("../model/rateUsModel");
const User = require("../model/usermodel");

// add new rate us data
const addRateUs = async (req, res) => {
    try {
      const userId = req.data._id;
      let user = await User.findOne({_id: userId});
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "user not found",
          response: [],
        });
      }
      const rateUs = new RateUs({
        rating: req.body.rating,
        userId: userId,
        userName: user.fullname
      });
      await rateUs.save();
  
      res.status(200).json({
        status: true,
        message: "rateUs data added successfully",
        response: { 
            rating: rateUs.rating,
            userId: user._id, 
            userName: user.fullname 
          },
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
  

// get RateUs-data
const getRateUs = async (req, res) => {
    try {
      const userId = req.data._id;
      let user = await User.findOne({_id: userId});
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "user not found",
          response: [],
        });
      }
  
      const getRating = await RateUs.find().populate('userId', 'userName');
  
      if (!getRating) {
        return res.status(404).json({
          status: false,
          message: "No RateUs found",
          response: [],
        });
      }
  
      const response = getRating.map(rating => ({
        rating: rating.rating,
        userId: rating.userId,
        userName: rating.userName,
      }));
  
      res.status(200).json({
        status: true,
        message: "RateUs retrieved successfully",
        response: response,
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
  
module.exports = { addRateUs, getRateUs };
