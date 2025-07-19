const express = require("express");
const router = express.Router();
const {userSignUP,userLogin, verifyOtp, upload, userLogout, getSingleUser, getUsers, deleteUser} = require('../controllers/UsersController.js');
const verifyJWT = require('../middlewares/jwtVerify.js')


router.route('/single-by-token').get(verifyJWT, getSingleUser)
router.route('/getall').get(verifyJWT, getUsers)
router.post("/add", upload.single("image") ,userSignUP);
router.route('/login').post(userLogin);
router.route('/logout').post(verifyJWT,  userLogout);
router.route('/verify-otp').post(verifyOtp)
router.route('/delete/:id').delete(verifyJWT, deleteUser)




module.exports = router

    