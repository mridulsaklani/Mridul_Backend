const express = require('express')
const {addQuote, getQuote} = require('../controllers/quote')
const router = express.Router()


router.post('/', addQuote)
router.get('/', getQuote)

module.exports = router