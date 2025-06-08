const express = require('express');
const router = express.Router();

const verifyJWT = require('../middlewares/jwtVerify')
const {isUserAuthenticated} = require("../controllers/AuthController");

router.route('/verify').get(verifyJWT, isUserAuthenticated);

module.exports = router