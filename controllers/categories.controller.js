const expressAsyncHandler = require("express-async-handler");
const Category = require("../models/categories.model");
const AppError = require("../utils/AppError");

exports.getCategories = expressAsyncHandler(async (req, res) => {
    const { enabled } = req.query;
    const queries = {};
    if (enabled) queries.enabled = enabled;

    const categories = await Category.find(queries);

    if (!categories || categories.length === 0) {
        throw new AppError("No categories found!", 404);
    }

    return res.status(200).json(categories);
});

exports.getCategory = expressAsyncHandler(async (req, res) => {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
        throw new AppError("No category found!", 404);
    }

    return res.status(200).json(category);
});

exports.addCategory = expressAsyncHandler(async (req, res) => {
    const { role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const { name, icon, enabled } = req.body;

    if (!name) return res.status(400).json({ type: "NAME", message: "Name is required!" });

    const category = await Category.findOne({ name });

    if (category) return res.status(400).json({ message: "Category already exist!" });

    const newCategory = new Category({ name });

    if (icon) newCategory.icon = icon;
    if (enabled) newCategory.enabled = enabled;

    const saveCategory = await newCategory.save();

    if (!saveCategory) return res.status(500).json({ message: "Couldn't save new category!" });

    res.json({ message: "Category created!", category: saveCategory });
});

exports.updateCategory = expressAsyncHandler(async (req, res) => {
    const { role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const { slug } = req.params;
    console.log(slug);
    const { name } = req.body;

    const category = await Category.findOne({ slug });

    if (!category) return res.status(404).json({ message: "Category not found!" });

    category.name = name;

    const saveCategory = await category.save();

    if (!saveCategory) return res.status(500).json({ message: "Couldn't save new category!" });

    res.json({ message: "Successfully Updated!", category: saveCategory });
});

exports.removeCategory = expressAsyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const { slug } = req.params;

    if (!slug) return res.status(400).json({ message: "slug is required!" });

    const deleteCategory = await Category.findOneAndDelete({ slug: slug });

    if (!deleteCategory) return res.status(404).json({ message: "Failed to delete category!" });

    res.json({ message: "Successfully deleted category!" });
});
