require('dotenv').config();


const express = require("express");
const app = express();
const cors = require("cors");   
const MongoDB = require('./config/mongodb')
const CookieParser = require('cookie-parser')
const PORT = process.env.PORT || 5000;
const path = require("path");


//Routes

const quoteRoute = require('./routes/quote')
const timelineRoute = require("./routes/timeline")
const UsersRoute = require('./routes/UserRoutes')
const VerifyAuth = require('./routes/AuthRouter')

//Routes End


app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser())
app.options("*", cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/user', UsersRoute)
app.use('/api/quote', quoteRoute)
app.use("/api/timeline", timelineRoute)
app.use('/api/auth', VerifyAuth)

MongoDB()

app.get('/', (req, res) => {
    res.send("Jai sri ram")
})

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})