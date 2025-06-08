const UserSchema = require('../models/User.model');

const mongoose = require('mongoose');
const multer = require('multer');

const verifyEmail = require("../service/mailer")
const CloudUpload = require('../service/cloudinary')



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

const generateAccessAndRefreshToken = async(userId) => {
  try {

     const user = await UserSchema.findById(userId);

     if(!user) {
        throw new Error("User not found");
     }

     const accessToken = user.generateAccessToken();
     const refreshToken = user.generateRefreshToken();

     user.refreshToken = refreshToken;
     await user.save();

     return { accessToken, refreshToken };

  } catch (error) {
     console.error("Error in generateAccessAndRefreshToken:", error);
     throw error;  
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


const getSingleUser = async(req, res)=>{
  try {
    const id = req.user?._id;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(401).json({message: 'Unauthorized mongoose user Id'})

    const response = await UserSchema.findById(id).select('-password, -refreshToken').lean()

    if(!response) return res.status(404).json({message: 'User data not found'})

    return res.status(200).json({message: "User data fetched successfully", user: response})
  } catch (error) {
    
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
        console.log(req.file?.path)
        const img = req.file?.path

        const imgurl = await CloudUpload(img)

        const response = await UserSchema.create({name, email, phone, image: imgurl.secure_url  , password, dob, otp});

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
    const { email, otp } = req.body;
    
    if(!email) return res.status(400).json({message: 'Invalid email'})
   
    if (!otp || isNaN(otp) ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing OTP. It should be a 6-digit number.",
      });
    }

    
    const user = await UserSchema.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    if(Number(user.otp) !== Number(otp)) return res.status(400).json({message: 'Invalid OTP, please try again'})

    
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

    const user = await UserSchema.findOne({email}).select('-password, -refreshToken');

    if(!user) return res.status(400).json({message: "User not exist, please check your mail"});

    const checkPassword = await user.isPasswordCorrect(password);

    if(!checkPassword) return res.status(401).json({message: "Your password is incorrect, please check your password"});

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'None', 
      domain: '.mridulsinghsaklani.com',
      path:"/"
    };

    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({message: "user Login successfully", user});


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
      secure: true,
      sameSite: 'None',
      domain: '.mridulsinghsaklani.com',
      path:"/"
    }

    res.status(200).clearCookie("accessToken", options).clearCookie('refreshToken', options).json({message: "User Logout successfully"})
    
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal server error"})
  }
}



module.exports = {
  getUsers,
  getSingleUser,
  userLogin,
  userSignUP,
  userLogout,
  verifyOtp,
  upload

};
