const timelineSchema = require("../models/Timelines.model");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/collections')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

const addTimeline = async (req, res) => {
    try {
        const { title, description, collection, image } = req.body;
        if(!title || !description || !collection || !image) return res.status(404).json({message: "fields are require"})
        const timeline = await timelineSchema.create({
            title,
            description,
            collection,
            image,
        });
        if (!timeline) return res.status(401).json({ message: "timeline not created" });
        return res.status(201).json({ message: "timeline created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
};


module.exports = { addTimeline, upload };