require("dotenv/config");
require("./config/db");
const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Running!");
});

// Listening to port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is listening on Port ${port}`);
});
