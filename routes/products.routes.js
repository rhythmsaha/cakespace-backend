const express = require("express");
const { addNewProduct, getAllProducts, getOneProduct } = require("../controllers/product.controller");
const router = express.Router();

const { authorize, publicAccess } = require("../middlewares/authorize");

router.post("/", authorize, addNewProduct);
router.get("/", publicAccess, getAllProducts);
router.get("/:slug", publicAccess, getOneProduct);

module.exports = router;
