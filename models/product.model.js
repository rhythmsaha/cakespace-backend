const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const AppError = require("../utils/AppError");
mongoose.plugin(slug);

const Product = new Schema(
  {
    name: {
      type: String,
      required: "Name is required!",
      trim: true,
      index: true,
      unique: true,
    },

    slug: {
      type: String,
      slug: "name",
      index: true,
      unique: true,
    },

    description: {
      type: String,
      required: "Description is required!",
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],

    flavours: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flavour",
      },
    ],

    weight: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: "Price is required!",
    },

    images: [
      {
        type: String,
        trim: true,
        required: "Image is required!",
      },
    ],

    stocks: {
      type: Number,
      default: 1,
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    purchases: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

Product.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new AppError("Product already exists!", 409, "duplicateError"));
  } else {
    next();
  }
});

module.exports = mongoose.model("Product", Product);
