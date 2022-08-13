const express = require("express");
const router = express.Router();

const { authorizeAdmin } = require("../middlewares/authorize");

const { registerSeller, loginSeller, getMe } = require("../controllers/authentication/sellerAuthentication");

router.post("/seller/signup", registerSeller);
router.post("/seller/login", loginSeller);
router.get("/seller/me", authorizeAdmin, getMe);

module.exports = router;
