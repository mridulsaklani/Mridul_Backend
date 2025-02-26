const Users = require('../models/users');
const bcrypt = require('bcrypt');


const {setUser} = require('../service/auth');
const exp = require('constants');

// Handler for creating a user
const handleUserPost = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({ name, email, phone, password: hashedPassword });

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
  
  

// Handler for finding a user by ID
const findUser = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
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
};
