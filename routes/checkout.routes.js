const express = require("express");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");
const { createPaymentIntent } = require("../controllers/payment.controller");

router.post("/create-payment-intent", authorize, createPaymentIntent);

module.exports = router;
