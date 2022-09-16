const express = require("express");
const { addNewProduct, getAllProducts } = require("../controllers/product.controller");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");

router.post("/", authorize, addNewProduct);
router.get("/", getAllProducts);

module.exports = router;
