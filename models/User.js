const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    minLength: 3,
    maxLength: 64,
    trim: true,
  },
  firstName: {
    required: true,
    type: String,
    minLength: 3,
    maxLength: 64,
  },
  lastName: {
    required: true,
    type: String,
    minLength: 3,
    maxLength: 64,
  },
  phoneNumber: {
    required: true,
    type: Number,
    minLength: 10,
    maxLength: 12,
  },
  password: {
    required: true,
    type: String,
    minLength: 8,
    maxLength: 64,
  },
  confirmed: { type: Boolean, default: false },
  resetPassword: {
    token: {
      type: String,
    },
    expireDate: {
      type: Date,
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(64).required(),
    firstName: Joi.string().min(3).max(64).required(),
    lastName: Joi.string().min(3).max(64).required(),
    phoneNumber: Joi.number().min(10).max(12).required(),
    password: Joi.string().min(8).max(64),
  });
  return schema.valid(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(64).required(),
    password: Joi.string().min(8).max(64),
  });
  return schema.valid(user);
}
