const expressAsyncHandler = require("express-async-handler");
const Order = require("../models/order.model");
const Review = require("../models/review.model");

exports.addReview = expressAsyncHandler(async (req, res) => {
  const { role, _id } = req.user;
  const { productId, review } = req.body;
});
