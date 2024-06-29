const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");

const redis = require("redis");
let RedisStore = require("connect-redis")(session)
let redisClient = redis.createClient({

})

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");


dotenv.config();
const app = express();
app.use(express.json());

const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`; //mongodb://username:password@mongoIP_or_auto reference to mongoImg:default_port/?authSource=admin

const connectWithRetry = () => {
    mongoose.connect(mongoURI)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((e) => {
            console.log(e);
            setTimeout(connectWithRetry, 5000); //If not connected --> wait for 5secs --> then again try to connect
        })
}
connectWithRetry();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("<h1>Hello from Docker-Node.js!!</h2>");
});
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
})