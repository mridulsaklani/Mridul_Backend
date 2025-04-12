const quoteSchema = require('../models/Quote.model');

const addQuote = async(req,res)=>{
    try{
        
        const {firstname, lastname, email, number, message} = req.body;

        if (!firstname || !lastname || !email || !number || !message) return res.status(404).json({message: "fields are require"})

        const quote = await quoteSchema.create({firstname, lastname, email, number, message});

        if(!quote) return res.status(401).json({message:"quote not created"})
            return res.status(201).json({message: "quote created successfully"})
    }
    catch(err){
       console.log(err);
       res.status(500).json(err.message)
    }

}

const getQuote = async (req, res)=>{
    try {
        const quote = await quoteSchema.find();
        if(!quote) return res.status(404).json({message: "quotes are not found"})
            return res.status(201).json(quote)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}


module.exports = {addQuote , getQuote}