const userSchema = require('../models/User.model')
const jwt = require('jsonwebtoken');

const checkForAuthentication = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
}

module.exports = {checkForAuthentication}