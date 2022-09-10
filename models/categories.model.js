const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const AppError = require("../utils/AppError");
mongoose.plugin(slug);

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: "{PATH} is required!", unique: true },
    slug: { type: String, slug: "name", index: true, unique: true },
    icon: { type: String },
    enabled: { type: Boolean, default: true },
    subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
});

const SubCategorySchema = new mongoose.Schema({
    name: { type: String, required: "{PATH} is required!" },
    slug: { type: String, slug: "name", index: true, unique: true },
    enabled: { type: Boolean, default: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

SubCategorySchema.post("save", function (error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        next(new AppError("Sub Category already exists!", 409, "duplicateError"));
    } else {
        next();
    }
});

CategorySchema.post("save", function (error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        next(new AppError("Category already exists!", 409, "duplicateError"));
    } else {
        next();
    }
});

const Category = mongoose.model("Category", CategorySchema);
const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

module.exports = { Category, SubCategory };
