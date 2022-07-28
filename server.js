require("dotenv/config");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

// Listening to port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is listening on Port ${port}`);
});
