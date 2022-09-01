const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Cake = new Schema({
    name: {
        type: String,
        required: "{PATH} is required!",
        trim: true,
        index: true,
    },
    slug: { type: String, slug: "name", index: true, unique: true },
    description: { type: String, required: "{PATH} is required!", trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    flavours: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flavour" }],
    weight: { type: String, required: "{PATH} is required!", trim: true },
    eggless: [{ type: Boolean, trim: true }],
    price: { type: Number, required: "{PATH} is required!" },
    images: [{ type: String, trim: true }],
    stock: { type: Number, default: 1 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    views: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
});

module.exports = mongoose.model("Cake", Cake);
