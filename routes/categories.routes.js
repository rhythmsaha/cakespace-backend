const express = require("express");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");

const { getCategories, getCategory, updateCategory } = require("../controllers/categories.controller");

router.get("/", getCategories);
router.get("/:slug", getCategory);
router.post("/", authorize, addCategory);
router.patch("/:slug", authorize, updateCategory);
router.delete("/:slug", authorize, removeCategory);

module.exports = router;
