const mongoose = require("mongoose");

const Notifcation = new mongoose.Schema(
    {
        type: { type: String, required: "{PATH} is required!" },
        title: { type: String },
        message: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notifcation", Notifcation);
