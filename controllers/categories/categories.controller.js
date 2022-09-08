const expressAsyncHandler = require("express-async-handler");
const { Category } = require("../../models/categories.model");
const AppError = require("../../utils/AppError");

exports.getCategories = expressAsyncHandler(async (req, res) => {
    const { enabled } = req.query;
    const queries = {};
    if (enabled) queries.enabled = enabled;

    const categories = await Category.find(queries);

    if (!categories || categories.length === 0) throw new AppError("No categories found!", 404);

    return res.status(200).json(categories);
});

exports.getCategory = expressAsyncHandler(async (req, res) => {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) throw new AppError("No category found!", 404);

    return res.status(200).json(category);
});

exports.addCategory = expressAsyncHandler(async (req, res) => {
    const { role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

    const { name, icon, enabled } = req.body;

    const newCategory = new Category({ name });

    if (icon) newCategory.icon = icon;
    newCategory.enabled = enabled;

    const saveCategory = await newCategory.save();

    if (!saveCategory) throw new AppError("Couldn't save new category!", 500);

    return res.status(200).json({ message: "Category created!", category: saveCategory });
});

exports.updateCategory = expressAsyncHandler(async (req, res) => {
    const { role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

    const { slug } = req.params;
    const { name, icon, enabled } = req.body;

    const category = await Category.findOne({ slug });

    if (!category) throw new AppError("Category not found!", 404);

    if (name) category.name = name;
    if (icon) category.icon = icon;
    category.enabled = enabled || false;

    const saveCategory = await category.save();

    if (!saveCategory) throw new AppError("Couldn't save new category!", 500);

    res.json({ message: "Successfully Updated!", category: saveCategory });
});

exports.removeCategory = expressAsyncHandler(async (req, res) => {
    const { role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

    const { slug } = req.params;

    if (!slug) throw new AppError("slug is required!", 400);

    const deleteCategory = await Category.findOneAndDelete({ slug: slug });

    if (!deleteCategory) throw new AppError("Failed to delete category!", 500);

    res.json({ message: "Successfully deleted category!", category: deleteCategory });
});
