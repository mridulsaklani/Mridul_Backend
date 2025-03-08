const express = require("express");
const MongoDB = require('./config/mongodb')
const app = express();
const cors = require("cors");   
const Users = require('./routes/users')
const CookieParser = require('cookie-parser')
const PORT = 5000;
const quoteRoute = require('./routes/quote')
const timelineRoute = require("./routes/timeline")


require('dotenv').config();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true,
  }));
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser())

app.use('/api/user', Users)
app.use('/api/quote', quoteRoute)
app.use("/api/timeline", timelineRoute)

MongoDB()

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})