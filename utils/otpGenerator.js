const otpgenerator = require("otp-generator");

// OTP Generator
const generateOtp = (length, dgt, up, lw, spc) => {
    let otp = otpgenerator.generate(length, {
      digits: dgt,
      upperCaseAlphabets: up,
      lowerCaseAlphabets: lw,
      specialChars: spc,
    });
    return otp;
  };

  module.exports = generateOtp