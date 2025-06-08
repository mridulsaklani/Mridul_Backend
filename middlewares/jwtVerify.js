const userSchema = require('../models/User.model')
const jwt = require('jsonwebtoken');

const checkForAuthentication = async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const verifyJwt = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    

    if (!verifyJwt) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await userSchema.findById(verifyJwt._id).select("-password -refreshToken");

    if(!user) return res.status(404).json({message: "User not found"});


    req.user = user;
    next();
}

module.exports = checkForAuthentication