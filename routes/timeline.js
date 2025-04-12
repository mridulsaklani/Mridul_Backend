const express = require("express");
const router = express.Router();

const {addTimeline, upload} = require('../controllers/TimelineController')

router.post("/",  upload.array("images") , addTimeline)

module.exports = router;