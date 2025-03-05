const express = require("express");
const router = express.Router();
const {handleUserPost,findUser, LoginUser, logoutUser,  upload} = require('../controllers/users')



router.post("/", upload.single("image") ,handleUserPost)
router.post("/login", LoginUser)
router.post("/logout", logoutUser)

router.get("/userdata",findUser)


module.exports = router

    