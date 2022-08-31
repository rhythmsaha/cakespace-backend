const express = require("express");

const dotenv = require("dotenv");
const app = express();
const connectDB = require("./config/db.config");
const cors = require("cors");

const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const authentication = require("./routes/authenticationRoute");

dotenv.config();
connectDB();

// common middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use("/auth", authentication);

app.get("/", (req, res) => {
    res.send("Running!");
});

app.use(notFound);
app.use(errorHandler);

// Listening to port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is listening on Port ${port}`);
});
