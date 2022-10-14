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

  const { category, subCategories, flavours = [], price, sortby, searchQuery } = req.query;

  const query = {};
  let sort = {};

  if (searchQuery) query.name = { $regex: searchQuery, $options: "i" };
  if (category) query.category = category;
  if (subCategories) query.subCategories = [subCategories];
  if (flavours.length > 0) query.flavours = { $in: flavours };
  if (price > 0) {
    if (price < 700) {
      query.price = { $lte: price };
    } else {
      query.price = { $gte: price };
    }
  }

  if (sortby === "PRICE_HIGH_TO_LOW") {
    sort.price = -1;
  } else if (sortby === "PRICE_LOW_TO_HIGH") {
    sort.price = 1;
  } else if (sortby === "POPULARITY") {
    sort.views = -1;
  }

  let products = [];

  if (role === "ADMIN") products = await Product.find().select("-__v").sort("-createdAt");
  else
    products = await Product.find({ ...query })
      .sort(sort)
      .select("-__v -views -purchases");

  if (!products) new AppError("No products found!", 404, "products");
  return res.json({ products: products });
});

exports.getFeaturedProducts = expressAsyncHandler(async (req, res) => {
  const [latestProducts, mostViewdProducts, mostPurchasedProducts] = await Promise.all([
    Product.find().sort({ createdAt: -1 }).limit(10).select("-__v -views -purchases"),
    Product.find({ views: { $gte: 1 } })
      .sort({ views: -1 })
      .limit(10)
      .select("-__v -purchases"),
    Product.find({ purchases: { $gte: 1 } })
      .sort({ purchases: -1 })
      .limit(10)
      .select("-__v -views"),
  ]);

  const featuredProducts = [];

  if (latestProducts.length > 0) {
    featuredProducts.push({
      title: "Recently Added",
      products: latestProducts,
    });
  }

  if (mostViewdProducts.length > 0) {
    featuredProducts.push({
      title: "Most Viewed Items",
      products: mostViewdProducts,
    });
  }

  if (mostPurchasedProducts.length > 0) {
    featuredProducts.push({
      title: "Most Purchased Items",
      products: mostPurchasedProducts,
    });
  }

  return res.json(featuredProducts);
});

exports.getOneProduct = expressAsyncHandler(async (req, res) => {
  const { role } = req?.user;
  const { slug } = req.params;

  let product;

  if (role === "ADMIN") {
    product = await Product.findOne({ slug }).populate("category subCategories flavours").select("-__v");
  } else {
    product = await Product.findOne({ slug }).select("-__v -views -purchases");
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

exports.increaseProductViews = expressAsyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const product = await Product.findOne({ slug });
  product.views += 1;

  const updateProduct = await product.save();
  if (!updateProduct) throw new AppError("Something went wrong!", 500);
  res.json({ product: updateProduct });
});
