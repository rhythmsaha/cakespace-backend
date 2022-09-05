const asyncHandler = require("express-async-handler");
const Flavour = require("../models/flavours.model");
const AppError = require("../utils/AppError");

exports.getFlavours = asyncHandler(async (req, res) => {
    const { enabled } = req.query;
    const flavours = await Flavour.find({ enabled });

    if (!flavours || flavours.length === 0) {
        throw new AppError("No Flavours found!", 404);
    }

    return res.status(200).json(flavours);
});

exports.getFlavour = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const flavour = await Flavour.findOne({ slug });

    if (!flavour) {
        res.status(404);
        throw new Error("No category found!");
    }

    return res.status(200).json(flavour);
});

exports.addFlavour = asyncHandler(async (req, res) => {
    const { role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const { name } = req.body;

    if (!name) res.status(400).json({ type: "NAME", message: "Name is required!" });

    const flavour = Flavour.findOne({ name });

    if (flavour) return res.status(400).json({ message: "Flavour already exist!" });

    const newFlavour = new Flavour({ name });

    const saveFlavour = await newFlavour.save();

    if (!saveFlavour) return res.status(500).json({ message: "Couldn't save new Flavour!" });

    res.json(saveFlavour);
});

exports.updateFlavour = asyncHandler(async (req, res) => {
    const { role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const { slug } = req.params;
    const { name } = req.body;

    const flavour = Flavour.findOne({ slug });

    if (!flavour) return res.status(404).json({ message: "Flavour not found!" });

    flavour.name = name;

    const saveFlavour = await flavour.save();

    if (!saveFlavour) return res.status(500).json({ message: "Couldn't save new Flavour!" });

    res.json(saveFlavour);
});

exports.deleteFlavour = asyncHandler(async (req, res) => {
    const { _id, role, type } = req?.user;

    if (type !== "AUTH_TOKEN" && role !== "ADMIN")
        return res.status(403).josn({ type: "AUTHORZATON", message: "Access denied!" });

    const { slug } = req.params;

    if (!slug) return res.status(400).json({ message: "slug is required!" });

    const deleteFlavour = await Flavour.findOneAndDelete({ slug: slug });

    if (!deleteFlavour) return res.status(404).json({ message: "Failed to delete Flavour!" });

    res.json({ message: "Successfully deleted Flavour!" });
});
