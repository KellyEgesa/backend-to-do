const mongoose = require("mongoose");
const joi = require("joi");

const companySchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minLength: 3,
    maxLength: 64,
  },
  createdAt: {
    required: true,
    default: Date.now(),
    type: Date,
  },
  companyLogo: {
    required: true,
    type: String,
    minLength: 3,
    maxLength: 256,
  },
  editor: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Company = mongoose.model("Company", companySchema);

function validateCompany(company) {
  const schema = joi.object({
    name: joi.string().min(3).max(64).required(),
    createdAt: joi.date().required(),
    companyLogo: joi.string().min(3).max(256).required(),
  });
  return schema.validate(company);
}

module.exports = Company;
module.exports = validateCompany;
