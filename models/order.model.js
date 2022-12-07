const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },

    transaction_id: String,
    orderStatus: {
      type: String,
      enum: ["PENDING", "CANCELED", "SUCCESS", "FAILED"],
    },
    deliveryStatus: {
      type: String,
      enum: ["ORDER_CONFIRMED", "SHIPPED", "DELIVERED"],
      default: "ORDER_CONFIRMED",
    },

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
        totalPrice: Number,
      },
    ],

    totalQuantity: {
      type: Number,
      required: true,
      min: [1, "Minimum 1 product is required"],
    },

    totalAmount: { type: Number, required: true },

    shhipping: {
      address: {
        city: String,
        country: String,
        line1: String,
        line2: String,
        postal_code: String,
        state: String,
      },
      carrier: String,
      name: String,
      phone: String,
      tracking_number: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
