const express = require("express");
const { getCart, addItemToCart, removeItemFromCart, clearCart } = require("../controllers/cart.controller");
const { authorize } = require("../middlewares/authorize");

const router = express.Router();

router.get("/", authorize, getCart);
router.put("/", authorize, addItemToCart);
router.delete("/", authorize, removeItemFromCart);
router.delete("/clear", authorize, clearCart);

module.exports = router;
