const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "This field is required "],
        trim: true,
        unique: true
    },
    shortDescription:{
        type: String,
        required: [true, "This field is required"],
        trim: true
    },
    category: [],
    author: {
        type: String,
        required: true,
        trim: true
    }

}, {timestamps: true});

module.exports = mongoose.model("blog", BlogSchema);