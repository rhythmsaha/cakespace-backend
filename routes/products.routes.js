const express = require("express");
const { addNewProduct } = require("../controllers/product.controller");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");

router.post("/", authorize, addNewProduct);

module.exports = router;
