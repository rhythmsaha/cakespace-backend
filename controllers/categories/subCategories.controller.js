const asyncHandler = require("express-async-handler");
const { SubCategory } = require("../../models/categories.model");
const AppError = require("../../utils/AppError");

exports.getSubCategories = asyncHandler(async (req, res) => {
    const { enabled } = req.query;
    const queries = {};
    if (enabled) queries.enabled = enabled;

    const subCategories = await SubCategory.find(queries);

    if (!subCategories || subCategories.length === 0) throw new AppError("No categories found!", 404);

    return res.status(200).json(subCategories);
});

exports.getSubCategory = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) throw new AppError("No category found!", 404);

    return res.status(200).json(category);
});

exports.addSubCategory = asyncHandler(async (req, res) => {});

exports.updateSubCategory = asyncHandler(async (req, res) => {});

exports.deleteSubCategory = asyncHandler(async (req, res) => {});
