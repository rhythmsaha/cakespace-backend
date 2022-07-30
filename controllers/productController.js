const expressAsyncHandler = require("express-async-handler");
const ProductModel = require("../models/ProductModel");
const Seller = require("../models/sellerModel");

exports.addNewProduct = expressAsyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        subCategory,
        weight,
        flavours,
        egg_type,
        price,
        images,
        seller,
        stock,
    } = req.body;

    if (
        !name ||
        !description ||
        !category ||
        !weight ||
        !flavours ||
        !egg_type ||
        !price ||
        !images ||
        !seller
    ) {
        res.status(400);
        throw new Error("Please fill the required fields!");
    }

    const newProduct = new ProductModel({
        name,
        description,
        category,
        subCategory,
        weight,
        flavours,
        egg_type,
        price,
        images,
        seller,
        stock,
    });

    const saveProduct = newProduct.save();

    res.status(200).josn(saveProduct);
});

exports.updateProduct = expressAsyncHandler(async (req, res) => {});

exports.deleteProduct = expressAsyncHandler(async (req, res) => {});

exports.getProduct = expressAsyncHandler(async (req, res) => {});

exports.getProducts = expressAsyncHandler(async (req, res) => {});
