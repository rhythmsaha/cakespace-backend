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
  updateSellerInfo,
  updateNotificationSettings,
} = require("../controllers/authentication/seller.auth.controller");

const {
  registerUser,
  loginUser,
  getUser,
  updateProfile,
} = require("../controllers/authentication/user.auth.controller");

router.post("/seller/signup", registerSeller);
router.post("/seller/login", loginSeller);
router.get("/seller/me", authorize, getMe);
router.post("/seller/forgetpassword", forgetSellerPassword);
router.post("/seller/resetpassword", authorize, resetSellerPassword);
router.post("/seller/changepassword", authorize, changeSellerPassword);
router.post("/seller/changeemail", authorize, changeSellerEmail);
router.post("/seller/verifyemail", authorize, updateSellerEmail);
router.post("/seller/updateinfo", authorize, updateSellerInfo);
router.post("/seller/update_notification_settings", authorize, updateNotificationSettings);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authorize, getUser);
router.put("/profile", authorize, updateProfile);

module.exports = router;
