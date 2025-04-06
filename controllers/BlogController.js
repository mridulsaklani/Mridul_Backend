const BlogSchema = require('../models/BlogSchema');


const getBlog = async(req,res)=>{
    try {
        const response = await BlogSchema.find({}).lean();
        if(!response) return res.status(400).json({message: "Blog not found"});
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const addBlog = async(req, res)=>{
    try {
        const {title, sortDescription, category, author} = req.body;
        if(!title || !sortDescription || !category || !author) return res.status(400).json({message: "All fields are required"});

        const response = await BlogSchema.create({title, sortDescription, category, author});

        if(!response) return res.status(400).json({message: "BlogSchema not created"});

        res.status(201).json({message: "Schema created successfully"});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}


module.exports = {
    getBlog,
    addBlog
}