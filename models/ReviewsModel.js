const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    stars: { type: Number, enum: [1, 2, 3, 4, 5] },
    description: { type: string },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

module.exports = mongoose.model("Review", Review);
