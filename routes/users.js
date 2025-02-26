const express = require("express");
const router = express.Router();
const {handleUserPost,findUser, LoginUser } = require('../controllers/users')



router.post("/",handleUserPost)
router.post("/login", LoginUser)


router.get("/:id",findUser)


module.exports = router

    