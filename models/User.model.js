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
    refreshToken:{
        type: String,
        default:""
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'] ,
        default: 'USER'
    }  

}, {timestamps: true});


// userSchema.methods.generatePassword()

module.exports = mongoose.model('users', userSchema);
