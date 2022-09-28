const express = require("express");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");

const {
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategories,
} = require("../controllers/categories/subCategories.controller");

router.get("/:slug", getSubCategories);
router.post("/", authorize, addSubCategory);
router.patch("/:id", authorize, updateSubCategory);
router.delete("/:id", authorize, deleteSubCategory);

module.exports = router;
