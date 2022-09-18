const express = require("express");
const { addNewProduct, getAllProducts } = require("../controllers/product.controller");
const router = express.Router();

const { authorize, publicAccess } = require("../middlewares/authorize");

router.post("/", authorize, addNewProduct);
router.get("/", publicAccess, getAllProducts);

module.exports = router;
