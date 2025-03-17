const Users = require('../models/users');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const multer = require('multer');


const {setUser,getUser} = require('../service/auth');
const exp = require('constants');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 }, });


const getUsers = async (req, res) => {
  try {
    const response = await Users.find({})
    if(!response) return res.status(404).json({message: "Users not found"});
    res.status(200).json(response)
  }
  catch(error){
    console.error(error);
  }
}

// Handler for creating a user
const handleUserPost = async (req, res) => {
    try {
        const { name, email, phone, password, dob } = req.body;

        if (!name || !email || !phone || !password || !dob) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({ name, email, phone, password: hashedPassword, dob, image: req.file ? req.file.path : '' });

        return res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const LoginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }
  
     
      const token = setUser(user);
  
      res.cookie("token", token , {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        expires: new Date(Date.now() + 15  * 60 * 1000)
      });
  
      return res.status(200).json({ message: "Login successful", token, user: { id: user._id, email: user.email } });
    } catch (err) {
      console.error("Error in LoginUser:", err.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  

  const logoutUser = async(req, res) => {
    try {
      
       res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path:"/"
       })

       return res.status(200).json({message: "Cookie deleted successfully"})
    } catch (error) {
      console.error(error.message);
      res.status(500).json({message: "internal server error"})
    }
  }
  

// Handler for finding a user by ID
const findUser = async (req, res) => {
    try {
        
        const token = req.cookies.token;
        if(!token) return res.status(400).json({message: "Token not exist"})


        const tokenUser = getUser(token);
        if (!tokenUser) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const id = tokenUser._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID format"});
        }
        
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found"});
        }

        return res.status(200).json(user);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const updateUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ message: "Cookie not found" });

    const user = getUser(token);
    if (!user) return res.status(404).json({ message: "User not found" });

    const id = user._id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid user ID" });

    const { name, email, phone, dob } = req.body;
    const image = req.file ? req.file.path : null;  

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (dob) updateFields.dob = dob;
    if (image) updateFields.image = image;

    const response = await Users.findByIdAndUpdate(id, { $set: updateFields }, { new: true, runValidators: true });
    if (!response) return res.status(404).json({ message: "User not found and update failed" });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  getUsers,
    handleUserPost,
    LoginUser,
    findUser,
    upload,
    logoutUser,
    updateUser
};
