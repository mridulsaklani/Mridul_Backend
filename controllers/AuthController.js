const mongoose = require("mongoose");
const userSchema = require('../models/User.model')

const isUserAuthenticated = async(req, res)=>{
    try {
       const id = req.user?._id 
       
       if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "ID is not valid mongoose Id"})
       
       const user = await userSchema.findById(id).select("-password -refreshToken");

       if(!user) return res.status(404).json({message: "User not found"});

       user.isActive = true

       await user.save({validateBeforeSave: false});

       return res.status(200).json({isAuthenticated: true, user})

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}


module.exports = {isUserAuthenticated}