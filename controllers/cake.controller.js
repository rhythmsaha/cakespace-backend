const expressAsyncHandler = require("express-async-handler");
const Cake = require("../models/cake.model");
const { isStringsArray } = require("../utils/validate");


exports.newCake = expressAsyncHandler(async (req, res) => {
    const { role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const { name, description, category, weight, flavours, eggless, price, images, stock } = req.body;

    if (!name || !description || !category || !weight || !flavours || !eggless || !price || !images) {
        return res.status(400).json({ type: "ALL", message: "Please fill all the required fields!" });
    }

    if (!name || typeof name !== String) {
        return res.status(400).json({ type: "NAME", message: "Please provide a valid name!" });
    }

    if (!description || typeof name !== String || description.length < 50) {
        return res.status(400).json({ type: "DESCRIPTION", message: "Description must be 50 characters long!" });
    }

    if (!weight || (typeof weight !== Number && weight < 10)) {
        return res.status(400).json({ type: "WEIGHT", message: "Please provide a valid weight!" });
    }

    if (!eggless || typeof eggless !== Boolean) {
        return res.status(400).json({ type: "EGGLESS", message: "Eggless type must be True or False!" });
    }

    if (!price || typeof price !== Number) {
        return res.status(400).json({ type: "PRICE", message: "Please provide a valid price!" });
    }

    if (!images || (images.length === 0 && !isStringsArray(images))) {
        return res.status(400).json({ type: "IMAGES", message: "Please provide a valid image link!" });
    }

    if (!stock || typeof stock !== Number) {
        return res.status(400).json({ type: "STOCKS", message: "Stocks must be number!" });
    }

    const cake = new Cake({
        name,
        description,
        category,
        flavours,
        weight,
        eggless,
        price,
        images,
        seller,
        stock,
    });

    const saveCake = await cake.save();

    if (!saveCake) {
        return res.status(500).json({ type: "ADD", message: "Failed to add new cake!" });
    }

    res.status(200).josn(saveCake);
});

exports.editCake = expressAsyncHandler(async (req, res) => {
    const { role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const { slug } = req.params;

    const { name, description, category, weight, flavours, eggless, price, images, seller, stock } = req.body;

    if (!name || !description || !category || !weight || !flavours || !egg_type || !price || !images || !seller) {
        return res.status(400).json({ type: "ALL", message: "Please fill all the required fields!" });
    }

    if (!name || typeof name !== String) {
        return res.status(400).json({ type: "NAME", message: "Please provide a valid name!" });
    }

    if (!description || typeof name !== String || description.length < 50) {
        return res.status(400).json({ type: "DESCRIPTION", message: "Description must be 50 characters long!" });
    }

    if (!weight || (typeof weight !== Number && weight < 10)) {
        return res.status(400).json({ type: "WEIGHT", message: "Please provide a valid weight!" });
    }

    if (!eggless || typeof eggless !== Boolean) {
        return res.status(400).json({ type: "EGGLESS", message: "Eggless type must be True or False!" });
    }

    if (!price || typeof price !== Number) {
        return res.status(400).json({ type: "PRICE", message: "Please provide a valid price!" });
    }

    if (!images || (images.length === 0 && !isStringsArray(images))) {
        return res.status(400).json({ type: "IMAGES", message: "Please provide a valid image link!" });
    }

    if (!stock || typeof stock !== Number) {
        return res.status(400).json({ type: "STOCKS", message: "Stocks must be number!" });
    }

    const updateOptions = {
        name: name,
        description: description,
        weight: weight,
        eggless: eggless,
        price: price,
        images: images,
        stock: stock,
    };

    const updateCake = await Cake.findOneAndUpdate({ slug }, updateOptions, { new: true });

    res.status(200).json(updateCake);
});

exports.deleteCake = expressAsyncHandler(async (req, res) => {
    const { role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const { slug } = req.params;

    const cake = await Cake.findOne({ slug });

    if (!cake) {
        return res.status(404).json({ type: "CAKE", message: "Cake not found!" });
    }

    const deleteCake = await Cake.findByIdAndDelete(cake._id);

    if (!deleteCake) {
        return res.status(500).json({ type: "DELETE", message: "Failed to delete cake!" });
    }
});

exports.getOneCake = expressAsyncHandler(async (req, res) => {
    const { role, type } = req?.user;

    const { slug } = req.params;

    const cake = await Cake.findOne({ slug });

    if (!cake) {
        return res.status(404).json({ type: "CAKE", message: "Cake not found!" });
    }

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") {
        delete cake["__v"];
        delete cake["views"];
        delete cake["purchases"];

        Cake.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
    }

    res.status(200).json(cake);
});

exports.getCakes = expressAsyncHandler(async (req, res) => {
    const { role, type } = req?.user;
    const { category, flavours, weight, eggless, price } = req.body;

    const queryOptions = {};

    if (category && category.length > 0) queryOptions.category = category;
    if (flavours && flavours.length > 0) queryOptions.flavours = { $in: flavours };
    if (weight && weight > 0) queryOptions.weight = weight;
    if (typeof eggless === Boolean) queryOptions.eggless = eggless;
    if (typeof price.low === Number && price >= 0 && typeof price.high === Number && price.high > price.low)
        queryOptions.price = { $gte: price.low, $lte: price.high };

    const cake = await Cake.find({ ...queryOptions });

    if (type !== "AUTH_TOKEN" && role !== "ADMIN") {
        delete cake["__v"];
        delete cake["views"];
        delete cake["purchases"];
    }

    res.status(200).json(cake);
});

exports.searchCake = expressAsyncHandler(async (req, res) => {});
