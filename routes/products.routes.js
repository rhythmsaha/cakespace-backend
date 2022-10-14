const express = require("express");
const {
  addNewProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  increaseProductViews,
} = require("../controllers/product.controller");
const router = express.Router();

const { authorize, publicAccess } = require("../middlewares/authorize");

router.post("/", authorize, addNewProduct);
router.get("/", publicAccess, getAllProducts);
router.get("/featured", publicAccess, getFeaturedProducts);
router.get("/:slug", publicAccess, getOneProduct);
router.put("/:id", authorize, updateProduct);
router.delete("/:id", authorize, deleteProduct);
router.post("/views/:slug", increaseProductViews);

module.exports = router;
