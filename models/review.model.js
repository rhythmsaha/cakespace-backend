const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  stars: { type: Number, enum: [1, 2, 3, 4, 5] },
  headline: { type: String, requierd: true },
  content: { type: String, required: true },
  cake: { type: mongoose.Schema.Types.ObjectId, ref: "Cake" },
});

module.exports = mongoose.model("Review", Review);
