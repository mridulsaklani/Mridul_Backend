const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true,
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        require: true,
        unique: true,
        trim:true
    },
    phone:{
        type:Number,
        require: true,
        trim: true
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
    otp:{
      type: Number,
      default: null,
    },
    emailVerified:{
     type: Boolean,
     default: false
    },
    isActive:{
       type: Boolean,
       default: false
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'] ,
        default: 'USER'
    }  

}, {timestamps: true});


userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

 userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password)
 };

 userSchema.methods.generateAccessToken = function (){
     return jwt.sign(
        {
            _id: this._id,
            email: this.email,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
     )
 }

 userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
        _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
 }

module.exports = mongoose.model('users', userSchema);
