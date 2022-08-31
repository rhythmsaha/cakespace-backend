const express = require("express");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");

const {
    registerSeller,
    loginSeller,
    getMe,
    forgetSellerPassword,
    resetSellerPassword,
    changeSellerPassword,
    changeSellerEmail,
    updateSellerEmail,
} = require("../controllers/authentication/seller.auth.controller");

router.post("/seller/signup", registerSeller);
router.post("/seller/login", loginSeller);
router.post("/seller/forgetpassword", forgetSellerPassword);
router.get("/seller/me", authorize, getMe);
router.post("/seller/resetpassword", authorize, resetSellerPassword);
router.post("/seller/changepassword", changeSellerPassword);
router.post("/seller/changeemail", authorize, changeSellerEmail);
router.post("/seller/verifyemail", authorize, updateSellerEmail);
router.post("/seller/updateinfo", authorize, updateSellerInfo);

module.exports = router;
