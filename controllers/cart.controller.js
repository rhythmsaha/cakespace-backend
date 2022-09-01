const expressAsyncHandler = require("express-async-handler");
const CartModel = require("../models/cart.model");
const cakeModel = require("../models/cake.model");

exports.addItemToCart = expressAsyncHandler(async (req, res) => {
    const { userId, cakeId, quantity } = req.body;

    let cart = await CartModel.findOne({ user: userId });
    const cake = await cakeModel.findById(cakeId);

    if (!cake) return res.status(400).json({ message: "Please select a cake!" });

    if (cart) {
        // add items to existing cart
    } else {
        // create cart and add items
    }
});

exports.removeItemFromCart = expressAsyncHandler(async (req, res) => {
    const { userId, cakeId, quantity } = req.body;

    let cart = await CartModel.findOne({ user: userId });
    const cake = await cakeModel.findById(cakeId);

    if (!cake) return res.status(400).json({ message: "Please select a cake!" });

    if (!cart) {
        return res.status(400).json({ message: "Cart doens't exist!" });
    }

    // remove items from existing cart
    res.status(200).json({
        success: true,
        message: "Successfully Removed!",
    });
});
