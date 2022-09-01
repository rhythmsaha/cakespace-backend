const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Flavour = new mongoose.Schema({
    name: { type: String, required: "{PATH} is required!" },
    slug: { type: String, slug: "name", index: true, unique: true },
    enabled: { type: Boolean, default: true },
});

module.exports = mongoose.model("Flavour", Flavour);
