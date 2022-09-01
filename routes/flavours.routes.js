const express = require("express");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");

const {
    getFlavours,
    getFlavour,
    addFlavour,
    updateFlavour,
    deleteFlavour,
} = require("../controllers/flavours.controller");

router.get("/", getFlavours);
router.get("/:slug", getFlavour);
router.post("/", authorize, addFlavour);
router.patch("/:slug", authorize, updateFlavour);
router.delete("/:slug", authorize, deleteFlavour);

module.exports = router;
