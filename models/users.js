const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require: true,
        unique: true
    },
    phone:{
        type:Number,
        require: true
    },
    password:{
        type:String,
        require: true       
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'] ,
        default: 'USER'
    }  

}, { Timestamps: true});

module.exports = mongoose.model('users', userSchema);
