const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  email: { type: String, index: true },
  code: { type: Number, required: true },
  phone: { type: Number },
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;
