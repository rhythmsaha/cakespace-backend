const mongoose = require("mongoose");
const { AddressSchema } = require("./address.model");

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity can not be less then 1."],
          default: 1,
        },
        price: Number,
      },
    ],

    totalQuantity: {
      type: Number,
      required: true,
      min: [1, "Minimum 1 product is required"],
    },

    totalPrice: { type: Number, required: true },

    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    billingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
