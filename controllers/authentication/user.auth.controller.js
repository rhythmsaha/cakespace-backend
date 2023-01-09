const jwt = require("jsonwebtoken");
const { default: validator } = require("validator");
const asyncHandler = require("express-async-handler");
const FormError = require("../../utils/formError");
const User = require("../../models/user.model");
const AppError = require("../../utils/AppError");
const { createJWT } = require("../../utils/jwt");
const { generateOTP } = require("../../utils/generateOTP");
const OTP = require("../../models/OtpModel");

exports.registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new FormError("Passwords don't match!", 400, "validationError", [
      {
        message: "Passwords don't match!",
        type: "validationError",
        path: "confirmPassword",
        value: confirmPassword,
      },
    ]);
  }

  const _user = new User({ firstName, lastName, email, password });

  const user = await _user.save();

  if (!user) {
    throw new AppError("Something went wrong", 500, "serverError");
  }

  return res.status(201).json({
    message: "Please check your email address to verify your account!",
  });
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    throw new FormError("Please provide a valid email address!", 400, "validationError", [
      {
        message: "Please provide a valid email address!",
        type: "validationError",
        path: "email",
        value: email,
      },
    ]);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new FormError("Email doesn't exist!", 404, "validationError", [
      {
        message: "Email doesn't exist!",
        type: "validationError",
        path: "email",
        value: email,
      },
    ]);
  }

  if (!user.verified) {
    throw new FormError("Email isn't verified!", 404, "verificationError", [
      {
        message: "Email isn't verified!",
        type: "verificationError",
        path: "email",
        value: email,
      },
    ]);
  }

  const checkPassword = await user.verifyPassword(password);

  if (!checkPassword) {
    throw new FormError("Incorrect Password!", 403, "validationError", [
      {
        message: "Incorrect Password!",
        type: "validationError",
        path: "password",
        value: password,
      },
    ]);
  }

  const JWT_TOKEN = createJWT({ role: "USER", type: "AUTH_TOKEN", _id: user._id }, "1d");

  return res.status(200).json({
    message: "Login Successfull!",
    authToken: JWT_TOKEN,
    user: user,
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const { _id, role, type } = req?.user;
  if (type !== "AUTH_TOKEN" && role !== "USER") throw new AppError("Access Denied!", 403, "authorization");

  const user = await User.findById(_id);

  if (!user) throw new AppError("Access Denied!", 403, "authorization");
  const JWT_TOKEN = createJWT({ role: "USER", type: "AUTH_TOKEN", _id: user._id }, "1d");

  return res.status(200).json({
    authToken: JWT_TOKEN,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
    },
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { _id, role, type } = req?.user;
  if (type !== "AUTH_TOKEN" && role !== "USER") throw new AppError("Access Denied!", 403, "authorization");

  const { firstName, lastName, gender } = req.body;

  const user = await User.findById(_id);

  user.firstName = firstName;
  user.lastName = lastName;
  user.gender = gender;

  const saveUser = await user.save();

  return res.status(200).json({
    message: "Updated Successfully!",
    firstName: saveUser.firstName,
    lastName: saveUser.lastName,
    gender: saveUser.gender,
  });
});

exports.requestEmailChange = asyncHandler(async (req, res) => {
  const { _id, role, type } = req?.user;
  if (type !== "AUTH_TOKEN" && role !== "USER") throw new AppError("Access Denied!", 403, "authorization");

  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    throw new FormError("Please provide a valid email address!", 400, "validationError", [
      {
        message: "Please provide a valid email address!",
        type: "validationError",
        path: "email",
        value: email,
      },
    ]);
  }

  const user = await User.findOne({ email });

  if (user) {
    throw new FormError("Email already exists!", 400, "validationError", [
      {
        message: "Email already exists!",
        type: "validationError",
        path: "email",
        value: email,
      },
    ]);
  }

  let code = await OTP.findOne({ email });

  if (code) {
    await code.delete();
  }

  const otp = generateOTP(6);
  const newOTP = new OTP({
    code: otp,
    email,
  });

  const saveOTP = await newOTP.save();

  return res.status(200).json({
    message: "We have sent an one time passcode to verify your email address!",
    verifyMode: true,
    email: email,
  });
});

exports.verifyAndUpdateEmail = asyncHandler(async (req, res) => {
  const { _id, role, type } = req?.user;
  if (type !== "AUTH_TOKEN" && role !== "USER") throw new AppError("Access Denied!", 403, "authorization");

  const { email, code } = req.body;

  if (!email) {
    throw new FormError("Please provide a valid email address!", 400, "validationError", [
      {
        message: "Please provide a valid email address!",
        type: "validationError",
        path: "email",
        value: email,
      },
    ]);
  }

  const otp = await OTP.findOne({ email });

  if (!code || !otp.verify(code)) {
    throw new FormError("Invalid code!", 403, "unauthorized", [
      {
        message: "Invalid code!",
        type: "unauthorized",
        path: "code",
        value: code,
      },
    ]);
  }

  if (otp.verify(code)) {
    await otp.delete();
  }

  const user = await User.findById(_id);

  user.email = email;

  const saveUser = await user.save();

  return res.status(200).json({
    message: "Updated successfully!",
    email: saveUser.email,
    firstName: saveUser.firstName,
    lastName: saveUser.lastName,
    gender: saveUser.gender,
  });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { _id, role, type } = req?.user;
  if (type !== "AUTH_TOKEN" && role !== "USER") throw new AppError("Access Denied!", 403, "authorization");

  const { password, newPassword, confirmPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    throw new FormError("Please enter a valid password!", 400, "validationError", [
      {
        message: "Please enter a valid password!",
        type: "validationError",
        path: "newPassword",
        value: newPassword,
      },
    ]);
  }

  if (newPassword !== confirmPassword) {
    throw new FormError("Passwords don't match!", 400, "validationError", [
      {
        message: "Passwords don't match!",
        type: "validationError",
        path: "confirmPassword",
        value: confirmPassword,
      },
    ]);
  }

  const user = await User.findById(_id);

  const checkPassword = await user.verifyPassword(password);

  if (!checkPassword) {
    throw new FormError("Incorrect Password!", 403, "validationError", [
      {
        message: "Incorrect Password!",
        type: "validationError",
        path: "password",
        value: password,
      },
    ]);
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    message: "Updated password successfully!",
  });
});

exports.NotificationSettings = asyncHandler(async (req, res) => {
  const { _id, role, type } = req?.user;

  if (type !== "AUTH_TOKEN" && role !== "USER") throw new AppError("Access Denied!", 403, "authorization");

  const { email_account, email_orders, email_offers, push_orders, push_offers } = req.body;

  const user = await User.findById(_id);

  user.emailSettings = {
    account: email_account,
    offers: email_offers,
    orders: email_orders,
  };

  user.notificationSettings = {
    orders: push_orders,
    offers: push_offers,
  };

  const saveSettings = await user.save();

  res.json({
    message: "Updated successfully!",
    email_account: saveSettings.emailSettings.account,
    email_offers: saveSettings.emailSettings.offers,
    email_orders: saveSettings.emailSettings.orders,
    push_orders: saveSettings.notificationSettings.orders,
    push_offers: saveSettings.notificationSettings.offers,
  });
});

exports.getNotificationsSettings = asyncHandler(async (req, res) => {
  const { _id, role, type } = req?.user;
  if (type !== "AUTH_TOKEN" && role !== "USER") throw new AppError("Access Denied!", 403, "authorization");

  const user = await User.findById(_id);

  if (!user) {
    throw new AppError("Access Denied!", 403, "authorization");
  }

  res.json({
    email_account: user.emailSettings.account,
    email_offers: user.emailSettings.offers,
    email_orders: user.emailSettings.orders,
    push_orders: user.notificationSettings.orders,
    push_offers: user.notificationSettings.offers,
  });
});
