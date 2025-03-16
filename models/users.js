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
    dob:{
        type: Date,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'] ,
        default: 'USER'
    }  

}, {timestamps: true});

module.exports = mongoose.model('users', userSchema);
