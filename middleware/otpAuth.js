const jwt = require("jsonwebtoken");
const User = require("../model/usermodel");

const isOtpAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.json({status:false,message:"Token not found, Please signup again after 10-min",response:[]})
    }
    
    const token = authorization.split(" ")[1];
    console.log('token:', token); // add this line to check the value of token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    console.log("decoded._id:", decoded.id);

    if (!user) {
      return res.json({status:false,message:"user not found",response:[]});
    }
    req.data = user;
    console.log("req.data:", req.data);

    next();
  } catch (error) {
    res.json({status:false,message: error.message,response:[]});
  }
};


module.exports = isOtpAuth;
