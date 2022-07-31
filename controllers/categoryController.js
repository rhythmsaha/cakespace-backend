const expressAsyncHandler = require("express-async-handler");
const { Category, SubCategory } = require("../models/Categories");

exports.getCategories = expressAsyncHandler(async (req, res) => {
    const categories = await Category.find();

    if (!categories) {
        res.status(404);
        throw new Error("No categories found!");
    }

    return res.status(200).json(categories);
});

exports.addCategory = expressAsyncHandler(async (req, res) => {
    // Add new Category
});

exports.updateCategory = expressAsyncHandler(async (req, res) => {});

exports.removeCategory = expressAsyncHandler(async (req, res) => {});

exports.getCategory = expressAsyncHandler(async (req, res) => {});

exports.getSubCategories = expressAsyncHandler(async (req, res) => {});

exports.addSubCategory = expressAsyncHandler(async (req, res) => {});

exports.updateSubCategory = expressAsyncHandler(async (req, res) => {});

exports.removeSubCategory = expressAsyncHandler(async (req, res) => {});

exports.getSubCategory = expressAsyncHandler(async (req, res) => {});
