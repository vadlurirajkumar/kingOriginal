const ContactUs = require("../model/contactUsModel")
const User = require("../model/usermodel")

// add feedback
const addContactUs = async(req,res)=>{
    try {
        const id = req.data._id;
        const user = await User.findById(id);
        if(!user){
            return res.status(400).json({
                status:false,
                message:"User token not valid",
                response:[]
            })
        }
        const {formName, formEmail, formPhoneNo, formMessage} = req.body;
        const feedback = new ContactUs({
            formName,
            formEmail,
            formPhoneNo,
            formMessage
          });
          await feedback.save();
        const response = {
            user_id : user._id,
            userName : user.fullname,
            feedback_id: feedback._id,
            feedbackName:feedback.formName,
            feedbackEmail:feedback.formEmail,
            feedbackPhoneNo:feedback.formPhoneNo,
            feedbackMessage:feedback.formMessage
        }
        res.status(200).json({
            status:true,
            message:"feedback received successfully",
            response:[response]
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            status:false,
            message:"Internal Server error",
            response:error.message
        })
    }
}

// get feedback
const getAllContactUs = async(req,res)=>{
    try {
        const feedback = await ContactUs.find()
        res.status(200).json({
            status:true,
            message:"All feedbacks fetched successfully",
            response:[feedback]
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"error in  fetching feedbacks",
            response:[]
        })
    }
}

module.exports = {addContactUs, getAllContactUs}