const express = require("express");
const { addReview } = require("../controllers/reviews.controller");
const { authorize } = require("../middlewares/authorize");

const router = express.Router();

router.get("/");
router.put("/", authorize, addReview);

module.exports = router;
