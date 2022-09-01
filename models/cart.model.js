const mongoose = require("mongoose");

const Cart = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    items: [
        {
            cake: { type: mongoose.Schema.Types.ObjectId, ref: "Cake" },
            quantity: Number,
            price: Number,
        },
    ],

    totalPrice: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
});

module.exports = mongoose.model("Cart", Cart);
