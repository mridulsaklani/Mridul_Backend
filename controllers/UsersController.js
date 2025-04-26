const UserSchema = require('../models/User.model');

const mongoose = require('mongoose');
const multer = require('multer');

const verifyEmail = require("../service/mailer")



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 }, });


// Generate access and refresh token

const generateAccessAndRefreshToken = async(userId)=>{
   try {
      
      const User = await UserSchema.findById(userId);
      const accessToken = await User.generateAccessToken();
      const refreshToken = await User.generateRefreshToken();

      User.refreshToken = refreshToken

      await User.save();

      return {accessToken, refreshToken}

   } catch (error) {
    console.error(error)
   }
}


const generateOTP = ()=>{
   return Math.floor(100000 + Math.random() * 900000)
}

const getUsers = async (req, res) => {
  try {
    const response = await UserSchema.find({}).select('-password -refreshToken').sort({createdAt: -1})
    if(!response) return res.status(404).json({message: "Users not found"});
    res.status(200).json(response);
  }
  catch(error){
    console.error(error);
  }
}

// Handler for creating a user
const userSignUP = async (req, res) => {
    try {
        const { name, email, phone, password, dob } = req.body;

        if (!name || !email || !phone || !password || !dob) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const userExist = await UserSchema.findOne({email});

        if(userExist) return res.status(400).json({message: "Use already exist, use another email"});

      
        const otp = generateOTP();

        const response = await UserSchema.create({name, email, phone, image: req.file.path || "", password, dob, otp});

        if(!response) return res.status(400).json({message: "Filed issue! user not created"});


        await verifyEmail(name, otp, email);


        res.status(201).json({message: "User created successfully, Verify otp send"});
        
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error"})
    }
};


const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

   
    if (!otp || isNaN(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing OTP. It should be a 6-digit number.",
      });
    }

    
    const user = await UserSchema.findOne({ otp: Number(otp) });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    
    user.emailVerified = true;
    user.otp = null;
 

    await user.save();

   
    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
     
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false, message: "Internal server error" });
  }
};




const userLogin = async(req,res) =>{
   try {

    const {email, password} = req.body;

    if(!email || !password) return res.status(400).json({message: "Field data is missing"});

    const user = await UserSchema.findOne({email});

    if(!user) return res.status(400).json({message: "User not exist, please check your mail"});

    if(user.emailVerified !== true) {
      const name = user.name;
      const otp = user.otp;
       await verifyEmail(name,otp,email);
       return res.status(400).json({message: "Email is not verified please check email and verify otp", emailVerified: false})
      }

    const checkPassword = await user.isPasswordCorrect(password);

    if(!checkPassword) return res.status(401).json({message: "Your password is incorrect, please check your password"});

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const options={
      httpOnly: true,
      secure: true
    }

    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({message: "user created successfully", user});


   } catch (error) {
    console.error(error)
    res.status(500).json({message: "Internal server error"})
   }
}

const userLogout = async(req,res)=>{
  try {
    
    const id = req.user?._id

    const loggedUser = await UserSchema.findByIdAndUpdate(id,{
      $set:{isActive: false, refreshToken: undefined}
    }, {new: true});

    if(!loggedUser) return res.status(400).json({message: "user not user logout because of DB error"})


    const options={
      httpOnly: true,
      secure: true
    }

    res.status(200).clearCookie("accessToken", options).clearCookie('refreshToken', options).json({message: "user Logout successfully"})
    
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal server error"})
  }
}



module.exports = {
  getUsers,
  userLogin,
  userSignUP,
  userLogout,
  verifyOtp,
  upload

};
