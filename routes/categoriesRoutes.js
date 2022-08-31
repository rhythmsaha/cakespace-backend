const express = require("express");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");

const { getCategories, getCategory, updateCategory } = require("../controllers/categoryController");

router.get("/categories", getCategories);
router.get("/categories/:slug", getCategory);
router.post("/categories", authorize, addCategory);
router.patch("/categories/:slug", authorize, updateCategory);
router.delete("/categories/:slug", authorize, removeCategory);

module.exports = router;
