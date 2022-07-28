require("dotenv/config");
require("./config/db");
const express = require("express");
const cors = require("cors");
const app = express();

const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const authentication = require("./routes/authenticationRoute");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(notFound);
app.use(errorHandler);

// API Routes
app.get("/", (req, res) => {
    res.send("Running!");
});

app.use("/auth", authentication);

// Listening to port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is listening on Port ${port}`);
});
