const UserSchema = require('../models/User.model');

const mongoose = require('mongoose');
const multer = require('multer');



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
      if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({message:"Invalid mongoose Id"})
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

        const userExist = await UserSchema.findOne({email}).lean();

        if(userExist) return res.json(400).json({message: "Use already exist"});

        const response = await UserSchema.create({name, email, phone, image: req.file.path, password, dob});

        if(!response) return res.status(400).json({message: "Filed issue! user not created"});

        res.status(201).json({message: "User created successfully"});
        
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error"})
    }
};


const userLogin = async(req,res) =>{
   try {

    const {email, password} = req.body;

    if(!email || !password) return res.status(400).json({message: "Field data is missing"});

    const user = await UserSchema.findOne({email});

    if(!user) return res.status(400).json({message: "User not exist"});

    const checkPassword = await user.isPasswordCorrect(password);

    if(!checkPassword) return res.status(401).json({message: "Your password is incorrect you are not authorized"});

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
  upload

};
