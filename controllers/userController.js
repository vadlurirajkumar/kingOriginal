const User = require("../model/usermodel");
const generateToken = require("../utils/jsonToken");
const generateOtp = require("../utils/otpGenerator");
const NodeGeocoder = require('node-geocoder');
const geolib = require("geolib");
const geocoder = NodeGeocoder({
  provider: 'openstreetmap'
});

// user registration
const signupUser = async (req, res) => {
  try {
    const { fullname, email, mobile } = req.body;
    let user = await User.findOne({ mobile });
    if (user) {
      return res
        .status(400)
        .json({ status: false, message: "user alredy exist", response: [] });
    }
    let otp = generateOtp(4, true, false, false, false);
    user = await User.create({
      fullname,
      email,
      mobile,
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
      status: "active", // set status to 'active' by default
    });
    let token = generateToken(user._id);

    res.status(200).json({
      status: true,
      message: "Otp sent successfully",
      response: [{ ...user._doc, token: token }],
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message, response: [] });
  }
};

// user verification
const verifyForSignup = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.data._id);
    if (user.otp !== otp || user.otp_expiry < Date.now()) {
      return res.json({
        status: false,
        message: "Invalid OTP or has been Expired",
        response: [],
      });
    }
    user.otp = null;
    user.otp_expiry = null;
    await user.save();

    const token = generateToken(user._id);
    res.json({
      status: true,
      message: `Welcome ${user.fullname}, Logged in successfully`,
      response: [{ ...user._doc, token: token }],
    });
  } catch (error) {
    res.json({ status: false, message: error.message, response: [] });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    let user = await User.findOne({ mobile });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "user not exist", response: [] });
    }
    //@ Generating OTP
    let otp = generateOtp(4, true, false, false, false);

    const token = generateToken(user._id);
    user.otp = otp;
    user.otp_expiry = new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000);
    await user.save();

    res.json({
      status: true,
      message: `OTP sent to : ${user.mobile}, please verify your mobile first`,
      response: [{ ...user._doc, token: token }],
    });
  } catch (error) {
    res.json({ status: false, message: error.message, response: [] });
  }
};

// login user
const login = async (req, res) => {
  try {
    const { mobile } = req.body;

    let user = await User.findOne({ mobile });

    //* Checking user has already exists or not with same mobile
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "user not exist", response: [] });
    }

    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(400).json({ status: false, message: "Your account is inactive. Please contact the admin.", response: [] });
    }

    //@ Generating OTP
    let otp = generateOtp(4, true, false, false, false);

    const token = generateToken(user._id);
    user.login_otp = otp;
    user.login_otp_expiry = new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000);
    await user.save();

    res.json({
      status: true,
      message: `OTP sent to : ${user.mobile}, please verify your mobile first`,
      response: [{ ...user._doc, token: token }],
    });
  } catch (error) {
    res.json({ status: false, message: error.message, response: [] });
  }
};

// checking user location for delivery
const checkLocationForDelivery = async (req,res) => {
  try {
    const id = req.data._id;

    let user = await User.findById(id);

    //* Checking user has already exists or not with same mobile
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "user not exist", response: [] });
    }

    // Convert user's location string to coordinates
    const userLocation = await geocoder.geocode(user.location);
    const userCoords = {
      latitude: userLocation[0].latitude,
      longitude: userLocation[0].longitude
    };

    // Calculate the distance between user's location and store location
    const storeCoords = {
      latitude: 17.4226184, // iprism data
      longitude: 78.379134
    };
    const distanceInMeters = geolib.getDistance(userCoords, storeCoords);
    const distanceInKm = distanceInMeters / 1000;
    console.log(distanceInKm)
    if (distanceInKm <= 15) {
      // User is within 15km range, save the user object
      await user.save();
      res.status(200).json({
        status: true,
        message: `user location is inside of delivery area`,
        response: [user],
      });
    } else {
      // User is outside of 15km range, show error message
      res.status(403).json({
        status: false,
        message: "Sorry, we cannot deliver to your location.",
        response: [],
      });
    }
  } catch (error) {
    res.json({ status: false, message: error.message, response: [] });
  }
}

//resend otp for login time
const resendOtpForLogin = async (req, res) => {
  try {
    const { mobile } = req.body;

    let user = await User.findOne({ mobile });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "user not exist", response: [] });
    }
    //@ Generating OTP
    let otp = generateOtp(4, true, false, false, false);

    const token = generateToken(user._id);
    user.login_otp = otp;
    user.login_otp_expiry = new Date(
      Date.now() + process.env.OTP_EXPIRE * 60 * 1000
    );
    await user.save();

    res.json({
      status: true,
      message: `OTP sent to : ${user.mobile}, please verify your mobile first`,
      response: [{ ...user._doc, token: token }],
    });
  } catch (error) {
    res.json({ status: false, message: error.message, response: [] });
  }
};

//verify for login
const verifyForLogin = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.data._id);
    if (user.login_otp !== otp || user.login_otp_expiry < Date.now()) {
      return res.json({
        status: false,
        message: "Invalid OTP or has been Expired",
        response: [],
      });
    }
    user.login_otp = null;
    user.login_otp_expiry = null;
    await user.save();

    const token = generateToken(user._id);
    res.json({
      status: true,
      message: `Welcome ${user.fullname}, Logged in successfully`,
      response: [{ ...user._doc, token: token }],
    });
  } catch (error) {
    res.json({ status: false, message: error.message, response: [] });
  }
};

// update location of user
const updateLocation = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.data._id,
      {
        location: req.body.location,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        status: false,
        message: `user not found`,
        response: [],
      });;
    }
    res.json({
      status: true,
      message: `user location updated successfully`,
      response: [user],
    });  } catch (err) {
    res.status(500).json({
      status: false,
      message: `server error`,
      response: []})
    }
};

// full profile edit
const editProfile = async (req, res) => {
  try {
    const id = req.data._id;
    const { fullname, email, location } = req.body;
    const fieldsToUpdate = {};
    if (fullname) fieldsToUpdate.fullname = fullname;
    if (email) fieldsToUpdate.email = email;
    if (location) fieldsToUpdate.location = location;
    const updatedUser = await User.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "user not found",
        response: [],
      });
    }
    const { ...rest } = updatedUser._doc;
    return res.status(200).json({
      status: true,
      message: "user details updated sucessfully",
      response: {
        ...rest,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      error,
      message: "Error in updating user details",
    });
  }
};

// get single user details
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.data._id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "user not found",
        response: [],
      });
    }
    return res.status(200).json({
      status: true,
      message: "user details fetched successfully",
      response: [user],
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      response: error.message,
    });
  }
};

module.exports = {
  signupUser,
  verifyForSignup,
  resendOtp,
  login,
  updateLocation,
  editProfile,
  getSingleUser,
  verifyForLogin,
  resendOtpForLogin,
  checkLocationForDelivery
};
