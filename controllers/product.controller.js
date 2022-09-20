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

    res.status(200).json(product);

    // const saveProduct = await product.save();

    // if (!saveProduct) throw new AppError("Failed to add new product!", 500, "product");

    // res.status(200).json({ message: "Added Successfully!", product: saveProduct });
});

exports.getAllProducts = expressAsyncHandler(async (req, res) => {
    const { role } = req.user;
    let products = [];

    if (role === "ADMIN") products = await Product.find().select("-__v");
    else products = await Product.find().select("-__v -views -purchases");

    if (!products) new AppError("No products found!", 404, "products");
    return res.json({ products: products });
});

exports.getOneProduct = expressAsyncHandler(async (req, res) => {
    const { role } = req.user;
    const { slug } = req.params;

    let product;

    if (role === "ADMIN") {
        product = await Product.findOne({ slug }).populate("category subCategory flavour").select("-__v");
    } else {
        product = await Product.findOne().select("-__v -views -purchases");
        Product.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
    }

    if (!product) throw new AppError("Product not found!", 404, "product");

    res.status(200).json(product);
});

// exports.deleteCake = expressAsyncHandler(async (req, res) => {
//     const { role, type } = req?.user;

//     if (type !== "AUTH_TOKEN" && role !== "ADMIN")
//         return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

//     const { slug } = req.params;

//     const cake = await Cake.findOne({ slug });

//     if (!cake) {
//         return res.status(404).json({ type: "CAKE", message: "Cake not found!" });
//     }

//     const deleteCake = await Cake.findByIdAndDelete(cake._id);

//     if (!deleteCake) {
//         return res.status(500).json({ type: "DELETE", message: "Failed to delete cake!" });
//     }
// });

// exports.getCakes = expressAsyncHandler(async (req, res) => {
//     const { role, type } = req?.user;
//     const { category, flavours, weight, eggless, price } = req.body;

//     const queryOptions = {};

//     if (category && category.length > 0) queryOptions.category = category;
//     if (flavours && flavours.length > 0) queryOptions.flavours = { $in: flavours };
//     if (weight && weight > 0) queryOptions.weight = weight;
//     if (typeof eggless === Boolean) queryOptions.eggless = eggless;
//     if (typeof price.low === Number && price >= 0 && typeof price.high === Number && price.high > price.low)
//         queryOptions.price = { $gte: price.low, $lte: price.high };

//     const cake = await Cake.find({ ...queryOptions });

//     if (type !== "AUTH_TOKEN" && role !== "ADMIN") {
//         delete cake["__v"];
//         delete cake["views"];
//         delete cake["purchases"];
//     }

//     res.status(200).json(cake);
// });

// exports.editCake = expressAsyncHandler(async (req, res) => {
//     const { role, type } = req.user;
//     if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

//     const { slug } = req.params;

//     const { name, description, category, weight, flavours, eggless, price, images, seller, stock } = req.body;

//     if (!name || !description || !category || !weight || !flavours || !egg_type || !price || !images || !seller) {
//         return res.status(400).json({ type: "ALL", message: "Please fill all the required fields!" });
//     }

//     if (!name || typeof name !== String) {
//         return res.status(400).json({ type: "NAME", message: "Please provide a valid name!" });
//     }

//     if (!description || typeof name !== String || description.length < 50) {
//         return res.status(400).json({ type: "DESCRIPTION", message: "Description must be 50 characters long!" });
//     }

//     if (!weight || (typeof weight !== Number && weight < 10)) {
//         return res.status(400).json({ type: "WEIGHT", message: "Please provide a valid weight!" });
//     }

//     if (!eggless || typeof eggless !== Boolean) {
//         return res.status(400).json({ type: "EGGLESS", message: "Eggless type must be True or False!" });
//     }

//     if (!price || typeof price !== Number) {
//         return res.status(400).json({ type: "PRICE", message: "Please provide a valid price!" });
//     }

//     if (!images || (images.length === 0 && !isStringsArray(images))) {
//         return res.status(400).json({ type: "IMAGES", message: "Please provide a valid image link!" });
//     }

//     if (!stock || typeof stock !== Number) {
//         return res.status(400).json({ type: "STOCKS", message: "Stocks must be number!" });
//     }

//     const updateOptions = {
//         name: name,
//         description: description,
//         weight: weight,
//         eggless: eggless,
//         price: price,
//         images: images,
//         stock: stock,
//     };

//     const updateCake = await Cake.findOneAndUpdate({ slug }, updateOptions, { new: true });

//     res.status(200).json(updateCake);
// });
