const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
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
    companyLogo: joi.string().min(3).max(256).required(),
    editor: joi
      .string()
      .required()
      .custom((value, helper) => {
        if (!ObjectId.isValid(value)) {
          return helper.message("Not a valid id");
        }
      }),
  });
  return schema.validate(company);
}

module.exports.Company = Company;
module.exports.validateCompany = validateCompany;
