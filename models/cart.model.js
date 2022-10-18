const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      totalPrice: Number,
    },
  ],

  totalAmount: { type: Number, default: 0 },
  totalQuantity: { type: Number, default: 0 },
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
