require("dotenv/config");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const expressAsyncHandler = require("express-async-handler");
const Cart = require("../models/cart.model");
const AppError = require("../utils/AppError");

const calculateOrderAmount = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (cart.totalQuantity === 0) {
    new AppError("Cart is empty", 400);
  }

  const totalPrice = +cart.totalAmount * 100;
  return totalPrice;
};

exports.createPaymentIntent = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  // Create a PaymentIntent with the order amount and currency

  const paymentIntent = await stripe.paymentIntents.create({
    amount: await calculateOrderAmount(_id),
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  console.log(paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
    orderId: paymentIntent.created,
    amount: paymentIntent.amount,
  });
});
