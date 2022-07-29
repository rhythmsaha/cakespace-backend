const mongoose = require("mongoose");

const Cart = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity can not be less then 1."],
                default: 1,
            },
            price: Number,
        },
    ],

    totalPrice: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
});

module.exports = mongoose.model("Cart", Cart);
