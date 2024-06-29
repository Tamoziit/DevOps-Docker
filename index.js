const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config");

dotenv.config();
const app = express();

const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`; //mongodb://username:password@mongoIP_or_auto reference to mongoImg:default_port/?authSource=admin
mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((e) => {
        console.log(e);
    })

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("<h1>Hello from Docker-Node.js!!</h2>");
})

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
})