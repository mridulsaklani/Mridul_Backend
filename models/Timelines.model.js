const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            unique: true,
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"]
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true
        },
        collections: {
            type: String,
            required: [true, "Collection name is required"],
            trim: true,
            lowercase: true
            
        },
        image: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true,
            validate: {
                validator: function (v) {
                    return /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif))$/.test(v);
                },
                message: "Please enter a valid image URL"
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Timeline', timelineSchema);
