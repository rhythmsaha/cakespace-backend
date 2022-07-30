const mongoose = require("mongoose");
const { Address } = require("./AddressModel");

const Order = new mongoose.Schema(
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

        shippingAddress: Address,
        billingAddress: Address,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", Order);