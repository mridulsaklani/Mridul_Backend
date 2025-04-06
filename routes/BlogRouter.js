const express = require("express");
const router = express.Router();
const {addBlog,getBlog} = require('../controllers/BlogController')


router.get('/', getBlog);
router.post('/', addBlog)

module.exports = router;