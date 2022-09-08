const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const AppError = require("../utils/AppError");
mongoose.plugin(slug);

const Flavour = new mongoose.Schema({
    name: { type: String, required: "{PATH} is required!", unique: true },
    slug: { type: String, slug: "name", index: true, unique: true },
    enabled: { type: Boolean, default: true },
});

Flavour.post("save", function (error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        next(new AppError("Flavour already exists!", 409, "duplicateError"));
    } else {
        next();
    }
});

module.exports = mongoose.model("Flavour", Flavour);
