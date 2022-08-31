const express = require("express");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");

router.get("/");
router.get("/:slug");
router.post("/", authorize);
router.patch("/:slug", authorize);
router.delete("/:slug", authorize);

module.exports = router;
