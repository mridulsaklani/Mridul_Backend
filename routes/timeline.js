const express = require("express");
const router = express.Router();

const {addTimeline, upload} = require('../controllers/timeline')

router.post("/",  upload.array("images") , addTimeline)

module.exports = router;