const mongoose = require("mongoose");
require("dotenv/config");

const db = mongoose
    .connect(process.env.MONGO_URI)
    .then((res) => {
        console.log(`MongoDB connected ${res.connection.host}`);
    })
    .catch((err) => console.log(err.message));

module.exports = db;
