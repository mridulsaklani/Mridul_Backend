const Users = require('../models/users');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const multer = require('multer');


const {setUser,getUser} = require('../service/auth');
const exp = require('constants');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage });
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
        sameSite: "strict",
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

module.exports = {
    handleUserPost,
    LoginUser,
    findUser,
    upload,
    logoutUser
};
