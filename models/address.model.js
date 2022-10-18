const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  firstname: {
    type: String,
    required: "{PATH} is required!",
    trim: true,
  },

  middlename: {
    type: String,
    trim: true,
  },

  lastname: {
    type: String,
    required: "{PATH} is required!",
    trim: true,
  },

  email: {
    type: String,
    required: "{PATH} is required!",
    trim: true,
  },

  company: String,

  street_address1: {
    type: String,
    required: "{PATH} is required!",
    trim: true,
  },
  street_address2: String,

  city: {
    type: String,
    required: "{PATH} is required!",
    trim: true,
  },

  state: {
    type: String,
    required: "{PATH} is required!",
    trim: true,
  },

  postal: {
    type: Number,
    required: "{PATH} is required!",
    trim: true,
  },

  phone: {
    type: Number,
    required: "{PATH} is required!",
    trim: true,
  },
});

const Address = mongoose.model("Address", AddressSchema);
module.exports = { Address, AddressSchema };
