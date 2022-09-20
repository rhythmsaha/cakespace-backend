const express = require("express");
const {
    addNewProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/product.controller");
const router = express.Router();

const { authorize, publicAccess } = require("../middlewares/authorize");

router.post("/", authorize, addNewProduct);
router.get("/", publicAccess, getAllProducts);
router.get("/:slug", publicAccess, getOneProduct);
router.put("/:id", authorize, updateProduct);
router.delete("/:id", authorize, deleteProduct);

module.exports = router;
