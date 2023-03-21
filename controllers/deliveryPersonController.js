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



module.exports = {createDeliveryBoy,loginDeliveryBoy}