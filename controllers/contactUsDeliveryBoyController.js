const ContactUsDeliveryBoy = require("../model/contactUsDeliveryBoyModel");
const Delivery = require("../model/deliveryPersonModel");

// add feedback
const addContactUsForDeliveryBoy = async (req, res) => {
  try {
    const {
      deliveryBoyId,
      deliveryBoyName,
      deliveryBoyMobile,
      deliveryBoyMessage,
    } = req.body;
    const delBoy = await Delivery.findById(deliveryBoyId);
    if (!delBoy) {
      return res.status(400).json({
        status: false,
        message: "DeliveryBoy not found",
        response: [],
      });
    }
    const feedback = new ContactUsDeliveryBoy({
      deliveryBoyId,
      deliveryBoyName,
      deliveryBoyMobile,
      deliveryBoyMessage,
    });
    await feedback.save();
    const response = {
      feedback_id: feedback._id,
      deliveryBoyId: feedback.deliveryBoyId,
      deliveryBoyName: feedback.deliveryBoyName,
      deliveryBoyMobile: feedback.deliveryBoyMobile,
      deliveryBoyMessage: feedback.deliveryBoyMessage,
    };
    res.status(200).json({
      status: true,
      message: "feedback received successfully",
      response: [response],
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server error",
      response: error.message
    });
  }
};
// get feedback
const getAllContactUsForDeliveryBoy = async (req, res) => {
  try {
    const feedback = await ContactUsDeliveryBoy.find();
    res.status(200).json({
      status: true,
      message: "All feedbacks fetched successfully",
      response: [feedback],
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "error in  fetching feedbacks",
      response: [],
    });
  }
};

module.exports = { addContactUsForDeliveryBoy, getAllContactUsForDeliveryBoy };
