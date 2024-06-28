const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("<h1>Hello from Docker-Node.js!!</h2>");
})

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
})