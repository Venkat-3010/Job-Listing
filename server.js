require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jobRoute = require('./routes/job');
const authRoute = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    console.log("at the Health api endpoint");
    res.json({
        service: "Backend Job Listing Api server",
        status: "active",
        time: new Date(), 
    });
});

app.use("/api/v1/job", jobRoute);
app.use("/api/v1/auth", authRoute);

app.use((error, req, res, next) => {
    console.log(error.message);
    res.status(500).json({
        message: "Something went wrong!"
    });
});

mongoose.connect(process.env.Mongodb_uri)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log("Db failed to connect",err);
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});