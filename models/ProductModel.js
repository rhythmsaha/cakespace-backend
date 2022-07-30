const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Product = new Schema({
    name: {
        type: String,
        required: "{PATH} is required!",
        trim: true,
        index: true,
    },
    slug: { type: String, slug: "name", index: true, unique: true },
    description: { type: String, required: "{PATH} is required!", trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    weight: { type: String, required: "{PATH} is required!", trim: true },
    flavours: [{ type: String, trim: true }],
    egg_type: [{ type: String, trim: true }],
    price: { type: Number, required: "{PATH} is required!" },
    images: [{ type: String, trim: true }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    stock: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
});

module.exports = mongoose.model("Product", Product);
