const express = require("express");
const router = express.Router();
const {handleUserPost,userLogin,  upload, updateUser} = require('../controllers/UsersController.js');
const verifyJWT = require('../middlewares/jwtVerify.js')



router.post("/add", upload.single("image") ,handleUserPost);
router.route('/login').post(userLogin);






module.exports = router

    