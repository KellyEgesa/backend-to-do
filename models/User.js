const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { jwtPrivateKey } = require("../secrets");

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
  profilePhoto: {
    type: String,
    minLength: 3,
    maxLength: 256,
  },
  company: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  ],
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

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    jwtPrivateKey
  );
  return token;
};

const User = mongoose.model("User", userSchema);

//More authentication needed under phoneNumber
function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(64).required(),
    firstName: Joi.string().min(3).max(64).required(),
    lastName: Joi.string().min(3).max(64).required(),
    phoneNumber: Joi.number().required(),
    password: Joi.string().min(8).max(64).required(),
  });
  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(64).required(),
    password: Joi.string().min(8).max(64),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;
