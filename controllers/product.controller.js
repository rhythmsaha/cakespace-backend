const expressAsyncHandler = require("express-async-handler");
const Product = require("../models/product.model");
const AppError = require("../utils/AppError");

exports.addNewProduct = expressAsyncHandler(async (req, res) => {
    const { role, type } = req.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

    const { name, description, category, subCategories, weight, flavours, price, images, stocks } = req.body;

    const options = { name, description, price, images, stocks };

    if (category) options.category = category?._id;
    if (subCategories) options.subCategories = subCategories.map((cat) => cat.value);
    if (flavours) options.flavours = flavours.map((flavour) => flavour.value);
    if (weight) options.weight = weight;

    const product = new Product(options);

    const saveProduct = await product.save();

    if (!saveProduct) throw new AppError("Failed to add new product!", 500, "product");

    res.status(200).json({ message: "Added Successfully!", product: saveProduct });
});

exports.getAllProducts = expressAsyncHandler(async (req, res) => {
    const { role } = req.user;

    let products = [];

    if (role === "ADMIN") products = await Product.find().select("-__v").sort("-createdAt");
    else products = await Product.find().select("-__v -views -purchases");

    if (!products) new AppError("No products found!", 404, "products");
    return res.json({ products: products });
});

exports.getOneProduct = expressAsyncHandler(async (req, res) => {
    const { role } = req?.user;
    const { slug } = req.params;

    let product;

    if (role === "ADMIN") {
        product = await Product.findOne({ slug }).populate("category subCategories flavours").select("-__v");
    } else {
        product = await Product.findOne().select("-__v -views -purchases");
        Product.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
    }

    if (!product) throw new AppError("Product not found!", 404, "product");

    res.status(200).json(product);
});

exports.updateProduct = expressAsyncHandler(async (req, res) => {
    const { role, type } = req.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

    const { id } = req.params;

    const { name, description, category, subCategories, weight, flavours, price, images, stocks } = req.body;

    const options = { name, description, price, images, stocks };

    if (category) options.category = category?._id;
    if (subCategories) options.subCategories = subCategories.map((cat) => cat.value);
    if (flavours) options.flavours = flavours.map((flavour) => flavour.value);
    if (weight) options.weight = weight;

    const updateProduct = await Product.findByIdAndUpdate(id, options, { new: true });

    res.status(200).json({ message: "Product Updated!", data: updateProduct });
});

exports.deleteProduct = expressAsyncHandler(async (req, res) => {
    const { role, type } = req.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

    const { id } = req.params;

    const deleteItem = await Cake.findByIdAndDelete(id);

    if (!deleteItem) throw new AppError("Failed to delete product!", 500);

    res.status(200).json({ message: "Product Deleted!", data: deleteItem });
});
