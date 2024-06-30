const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const redis = require("redis");
const RedisStore = require("connect-redis").default; //Redis class
const redisClient = redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`
});

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

//Redis init
redisClient.on('error', (err) => console.log('Redis Client Error', err));
(async () => {
    await redisClient.connect();
    console.log("Connected to RedisDB");
})();

//Middlewares
app.enable("trust proxy"); //Enables the server to listen to all proxy requests from NGINX IPs
app.use(cors({})); //default CORS settings
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000
    }
}));


const PORT = process.env.PORT || 3000;

app.get("/api/v1", (req, res) => {
    res.send("<h1>Hellooooo from Docker-Node.js!!</h2>");
    console.log("Running Successfully")
});
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
})