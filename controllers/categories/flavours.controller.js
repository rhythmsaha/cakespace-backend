const asyncHandler = require("express-async-handler");
const Flavour = require("../../models/flavours.model");
const AppError = require("../../utils/AppError");

exports.getFlavours = asyncHandler(async (req, res) => {
  const { enabled } = req.query;

  const queries = {};
  if (enabled) queries.enabled = enabled;

  const flavours = await Flavour.find(queries).sort({ name: 1 });

  if (!flavours || flavours.length === 0) throw new AppError("No Flavours Found!", 404);

  return res.status(200).json(flavours);
});

exports.getFlavour = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const flavour = await Flavour.findOne({ slug });

  if (!flavour) throw new AppError("No Flavour found!", 404);

  return res.status(200).json(flavour);
});

exports.addFlavour = asyncHandler(async (req, res) => {
  const { role, type } = req?.user;
  if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

  const { name, enabled } = req.body;

  const newFlavour = new Flavour({ name, enabled });

  const saveFlavour = await newFlavour.save();

  if (!saveFlavour) throw new AppError("Couldn't save new Flavour!", 500);

  res.json({ message: "Category created!", flavour: saveFlavour });
});

exports.updateFlavour = asyncHandler(async (req, res) => {
  const { role, type } = req?.user;
  if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

  const { slug } = req.params;
  const { name, enabled } = req.body;

  const flavour = await Flavour.findOne({ slug });

  if (!flavour) throw new AppError("Flavour not found!", 404);

  if (name) flavour.name = name;

  const saveFlavour = await flavour.save();

  if (!saveFlavour) return res.status(500).json({ message: "Couldn't save new Flavour!" });

  res.json({ message: "Successfully Updated!", flavour: saveFlavour });
});

exports.deleteFlavour = asyncHandler(async (req, res) => {
  const { role, type } = req?.user;
  if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

  const { slug } = req.params;

  if (!slug) throw new AppError("slug is required!", 400);

  const deleteFlavour = await Flavour.findOneAndDelete({ slug: slug });

  if (!deleteFlavour) return res.status(404).json({ message: "Failed to delete flavour!" });

  res.json({ message: "Successfully deleted Flavour!", flavour: deleteFlavour });
});
