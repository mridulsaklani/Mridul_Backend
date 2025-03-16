const express = require("express");
const router = express.Router();
const {handleUserPost,findUser, LoginUser, logoutUser,  upload, updateUser} = require('../controllers/UsersController.js')



router.post("/", upload.single("image") ,handleUserPost)
router.post("/login", LoginUser)

router.post("/logout", logoutUser)

router.get("/userdata",findUser)
router.patch("/", upload.single("image"), updateUser)


module.exports = router

    