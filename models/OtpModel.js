const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchema = new Schema(
  {
    email: { type: String, index: true },
    code: { type: Number, required: true },
    phone: { type: Number },
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: "1h" },
    },
  },
  {
    methods: {
      verify(code) {
        console.log(code, this.code);
        return +code === +this.code;
      },
    },
  }
);

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;
