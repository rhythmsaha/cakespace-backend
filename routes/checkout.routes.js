const express = require("express");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");
const { createPaymentIntent, webhook } = require("../controllers/payment.controller");

router.post("/create-payment-intent", authorize, createPaymentIntent);
router.post("/webhook", webhook);

module.exports = router;
