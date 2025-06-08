const jwt = require('jsonwebtoken');

function setUser(payload) {
    return jwt.sign({
        _id: payload._id,
        email: payload.email
    }, process.env.JWT_SECRET,{expiresIn: '15m'});
}

function getUser(token) {
    if(!token) return null;
    try {
        
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.log(error);
        return null;
    }

}

module.exports = {setUser, getUser};