const { Schema } = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const SubCategory = new Schema({
    name: String,
    slug: { type: String, slug: "name", index: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

const Category = new Schema({
    name: { type: String, required: "{PATH} is required!" },
    slug: { type: String, slug: "name", index: true, unique: true },
    subCategories: [
        { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    ],
});

module.exports = {
    Category: model("Category", Category),
    SubCategory: model("SubCategory", SubCategory),
};
