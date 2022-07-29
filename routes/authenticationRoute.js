const express = require("express");
const router = express.Router();

const { authorizeAdmin } = require("../middlewares/authorize");

const {
    registerSeller,
    loginSeller,
    verifyAccount,
    resendVerificationLink,
    getMe,
} = require("../controllers/authentication/sellerAuthentication");

router.post("/seller/signup", registerSeller);
router.post("/seller/login", loginSeller);
router.post("/seller/verify", verifyAccount);
router.post("/seller/resendlink", resendVerificationLink);
router.get("/seller/me", authorizeAdmin, getMe);

module.exports = router;
