const jwt = require("jsonwebtoken");
const  Admin  = require("../model/adminModel");

//  const isAdminAuth = async (req, res, next) => {
//   try {
//     const { authorization } = req.headers;
//     if (!authorization) {
//     res.status(500).json({status:false, message:"token not found please login first", response:[]})
//       // console.log("auth " + authorization);
//     }
//     const token = authorization.split(" ")[1];
//     // console.log("token " + token);

//     var decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = await Admin.findById(decoded._id);
//     // console.log(req.user._id)
//     next();
//   } catch (error) {
//     res.status(500).json({status:false, message: "auth error", response:error.message });
//   }
// };

const isAdminAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access. Please provide a valid token.",
        response: []
      });
    }
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded._id;
    req.admin = await Admin.findById(adminId);
    next();
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Authentication error.",
      response: error.message
    });
  }
};


module.exports = isAdminAuth