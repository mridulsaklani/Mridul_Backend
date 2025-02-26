const {getUser} =  require('../service/auth')
const checkForAuthentication = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = getUser(token);

    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
}

module.exports = {checkForAuthentication}