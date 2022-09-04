const express = require("express");

const dotenv = require("dotenv");
const app = express();
const connectDB = require("./config/db.config");
const cors = require("cors");
const Redis = require("redis");

const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const authenticationRoute = require("./routes/authentication.routes");
const categoriesRoute = require("./routes/categories.routes");
const flavoursRoute = require("./routes/flavours.routes");

const redisClient = Redis.createClient({
    url: "redis://redis-12781.c305.ap-south-1-1.ec2.cloud.redislabs.com:12781",
    password: "IZOZdKcFSXLwHMqRjSY0m4QSVJmmUXV6",
});

redisClient.connect();

redisClient.on("connect", function () {
    console.log("Connected!");
});

dotenv.config();
connectDB();

// common middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use("/auth", authenticationRoute);
app.use("/categories", categoriesRoute);
app.use("/flavours", flavoursRoute);

app.get("/test", async (req, res) => {
    const name = await redisClient.get("name");
    res.send(name);
});

app.get("/test/:name", async (req, res) => {
    const { name } = req.params;
    redisClient.set("name", name);
    res.send("done");
});

app.use(notFound);
app.use(errorHandler);

// Listening to port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is listening on Port ${port}`);
});
