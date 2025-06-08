const express = require('express')
const {addQuote, getQuote} = require('../controllers/QuoteController')
const router = express.Router()


router.post('/', addQuote)
router.get('/', getQuote)

module.exports = router