require("dotenv/config");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const expressAsyncHandler = require("express-async-handler");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");

exports.createPaymentIntent = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id) new AppError("Access Denied", 400);

  const cart = await Cart.findOne({ user: _id });

  if (cart.totalQuantity === 0) new AppError("Cart is empty", 400);

  const totalPrice = +cart.totalAmount * 100;

  // Create a PaymentIntent with the order amount and currency

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  console.log("payment intent created");

  res.send({
    clientSecret: paymentIntent.client_secret,
    orderId: paymentIntent.created,
    amount: paymentIntent.amount,
  });
});

exports.webhook = expressAsyncHandler(async (request, response) => {
  let event = request.body;
  console.log(`webhook init`);
  console.log(event.type);

  // // Only verify the event if you have an endpoint secret defined.
  // // Otherwise use the basic event deserialized with JSON.parse
  // if (endpointSecret) {
  //   // Get the signature sent by Stripe
  //   console.log("webhook signature");
  //   const signature = request.headers["stripe-signature"];
  //   try {
  //     event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
  //   } catch (err) {
  //     console.log(`⚠️  Webhook signature verification failed.`, err.message);
  //     return response.sendStatus(400);
  //   }
  // }

  // // Handle the event

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);

      const user = await User.findOne({ email: paymentIntent.receipt_email });
      let cart = await Cart.findOne({ user: user._id });

      cart.items = [];
      cart.totalQuantity = 0;
      cart.totalAmount = 0;

      await cart.save();
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
