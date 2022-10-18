const expressAsyncHandler = require("express-async-handler");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");

const createEmptyCart = async (userId) => {
  const cart = new Cart({ user: userId, items: [] });
  const saveCart = await cart.save();

  if (!saveCart) throw new AppError("Something went wrong!", 400);

  const _user = await User.findById(userId);
  _user.cart = saveCart._id;
  _user.save();

  return saveCart;
};

exports.getCart = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  let cart = await Cart.findOne({ user: _id }).populate("items.product");

  if (cart) {
    cart.totalQuantity = cart.items.reduce((value, _item) => value + _item.quantity, 0);
    cart.totalAmount = cart.items.reduce((value, _item) => value + _item.totalPrice, 0);

    const saveCart = await cart.save();
    return res.json({ cart: saveCart });
  } else {
    cart = await createEmptyCart(_id);
    return res.status(201).json({ cart: cart });
  }
});

exports.addItemToCart = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;

  let cart = await Cart.findOne({ user: _id });
  if (!cart) cart = await createEmptyCart(_id);

  const product = await Product.findById(productId);

  if (!product) return res.status(400).json({ message: "Please select a Product!" });

  const existingItem = cart.items.find((item) => item.product.equals(productId));

  if (!existingItem) {
    cart.items.push({ product: product._id, quantity: 1, totalPrice: product.price });
  } else {
    const item = existingItem;

    item.quantity++;
    item.totalPrice = product.price * item.quantity;

    const cartItems = cart.items.map((_item) => {
      if (_item.product.equals(product._id)) return item;
      else return _item;
    });

    cart.items = cartItems;
  }

  cart.totalQuantity = cart.items.reduce((value, _item) => value + _item.quantity, 0);
  cart.totalAmount = cart.items.reduce((value, _item) => value + _item.totalPrice, 0);

  const saveCart = await cart.save().then((__cart) => __cart.populate("items.product"));

  res.send({ message: "Added to Cart!", cart: saveCart });
});

exports.deleteItem = expressAsyncHandler(async (req, res) => {});
exports.deleteAll = expressAsyncHandler(async (req, res) => {});

exports.removeItemFromCart = expressAsyncHandler(async (req, res) => {
  const { productId } = req.body;
  const { role, _id } = req.user;

  if (!productId) throw new AppError("ProductId is required!", 400);

  let cart = await Cart.findOne({ user: _id });
  const existingItem = cart.items.find((item) => item.product.equals(productId));

  if (!existingItem) throw new AppError("Product doesn't exist in cart!", 400);

  // if (existingItem.quantity > 1) {
  //   const product = await Product.findById(productId);
  //   const item = { ...existingItem };

  //   item.quantity--;
  //   item.price = item.quantity * product.price;

  //   const cartItems = cart.items.map((_item) => {
  //     if (_item.product._id === productId) return item;
  //     else return _item;
  //   });

  //   cart.items = cartItems;
  // } else {
  //   const cartItems = cart.items.filter((_item) => _item.product._id !== productId);
  //   cart.items = cartItems;
  // }

  const cartItems = cart.items.filter((_item) => _item.product.toString() !== productId);
  cart.items = cartItems;
  cart.totalQuantity = cart.items.reduce((value, _item) => value + _item.quantity, 0);
  cart.totalAmount = cart.items.reduce((value, _item) => value + _item.totalPrice, 0);

  const saveCart = await cart.save().then((__cart) => __cart.populate("items.product"));

  res.status(200).json({
    success: true,
    message: "Successfully removed item!",
    cart: saveCart,
  });
});

exports.clearCart = expressAsyncHandler(async (req, res) => {
  const { role, _id } = req.user;

  let cart = await Cart.findOne({ user: _id });

  cart.items = [];
  cart.totalQuantity = 0;
  cart.totalAmount = 0;

  const _clearCart = await cart.save();
  res.status(200).json({
    success: true,
    message: "Successfully removed items!",
    cart: _clearCart,
  });
});
