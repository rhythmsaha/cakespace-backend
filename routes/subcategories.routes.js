const express = require("express");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");

const {
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
} = require("../controllers/categories/subCategories.controller");

router.post("/", authorize, addSubCategory);
router.patch("/:id", authorize, updateSubCategory);
router.delete("/:id", authorize, deleteSubCategory);

module.exports = router;
