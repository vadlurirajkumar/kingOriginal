const DeliveryPerson = require("../model/deliveryPersonModel")

// signup delivery person
const createDeliveryBoy = async(req, res) => {
    try {
        const {mobile, fullname, password, area} = req.body
        const existingDelBoy = await DeliveryPerson.findOne({mobile})
        if(existingDelBoy){
            return res.status(400).json({
                status: false,
                message: "Delivery Boy already exists with this mobile number",
                response: []
            })
        }
        const newDelBoy = await DeliveryPerson.create({
            fullname,
            mobile,
            password,
            area,
            status: "active", // set status to 'active' by default
        })
        res.status(200).json({
            status: true,
            message: "New delivery person created",
            response: [newDelBoy]
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            response: []
        })
    }
}

//login delivery person
const loginDeliveryBoy = async (req,res) => {
    try {
        const {mobile, password} = req.body;
        if(!mobile || !password){
            return res.status(400).json({
                status:false,
                message:"please enter all fields",
                response:[]
            });
        }
        const delBoy = await DeliveryPerson.findOne({mobile});
        if(!delBoy){
            return res.status(400).json({
                status:false,
                message:"delivery boy with this mobile number does not exist",
                response:[]
            });
        }
        if(delBoy.status === "inactive"){
            return res.status(400).json({
                status:false,
                message:"contact admin for log-in",
                response:[]
            });
        }

        const isMatch = await delBoy.comparePassword(password);
        if (!isMatch) {
          return res.status(400).json({
            status: false,
            message: "Password is incorrect",
            response: [],
          });
        }
        res.status(200).json({
            status:true,
            message:`welcome ${delBoy.fullname}, Logged in successfully`,
            response:[delBoy]
        });
    } catch (error) {
        res.status(500).json({
            status:false,
            message:error.message,
            response:[]
        });
    }
};

// delivery boy onDuty toggle
const dbOnDuty = async (req,res) => {
    try {
        const delBoyId = req.params.id;
        const delBoy = await DeliveryPerson.findById(delBoyId);
    
        if (!delBoy) {
          return res.status(404).send({
            status: false,
            message: "deliverBoy not found",
          });
        }
    
        const newOnDuty = delBoy.onDuty === "on" ? "off" : "on";
        const updatedDelBoy = await DeliveryPerson.findByIdAndUpdate(
          delBoyId,
          { $set: { onDuty: newOnDuty } },
          { new: true }
        );
    
        const response = {
          id: updatedDelBoy._id,
          fullname: updatedDelBoy.fullname,
          area: updatedDelBoy.area,
          mobile:updatedDelBoy.mobile,
          password:updatedDelBoy.password,
          status: updatedDelBoy.status,
          onDuty:updatedDelBoy.onDuty,
          createdAt: updatedDelBoy.createdAt,
          updatedAt: updatedDelBoy.updatedAt,
        };
    
        res.status(200).send({
          status: true,
          message: "delivery boy onDuty status updated successfully",
          response: [response],
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          status: false,
          message: "Error in updating deliveryBoy status",
          error,
        });
      } 
}


module.exports = {createDeliveryBoy,loginDeliveryBoy,dbOnDuty}