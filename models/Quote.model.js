const mongoose = require('mongoose')


const quoteSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required: true
    },
    lastname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    number:{
        type:Number,
        required: true
    },
    message:{
        type:String,
        required: true
    },
})

module.exports = mongoose.model('quotes', quoteSchema);