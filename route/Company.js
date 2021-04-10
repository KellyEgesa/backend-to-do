const express = require("express");
const auth = require("../middleware/Auth");
const { validateCompany, Company, addUser } = require("../models/Company.Js");
const mongoose = require("mongoose");
const { User } = require("../models/User");

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

router.post("/create", auth, async (req, res) => {
  const { error } = validateCompany(req.body);
  if (error)
    res.status(400).send({
      message: error.details[0].message,
    });

  if (req.body.editor !== req.user._id)
    res.status(400).send({ message: "Conflicting users" });

  let user = await User.findById(req.body.editor);
  if (!user) res.status(404).send({ message: "User not found" });

  let company = new Company({
    name: req.body.name,
    companyLogo: req.body.companyLogo,
    editor: req.body.editor,
  });

  let saved;

  await company.save().then((result) => {
    saved = result;
    User.updateOne(
      { _id: req.body.editor },
      { $push: { company: result } }
    ).catch((error) => {
      res.status(500).send(error.details[0].message);
    });
  });
  return res.send(saved);
});

router.get("/retrieve/:id", auth, async (req, res) => {
  const validId = ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send({ message: "Invalid parameters" });

  const company = await Company.findById(req.params.id);
  if (!company)
    return res.status(404).send({
      message: "Company not found",
    });

  return res.send(company);
});

router.put("/user/:id", auth, async (req, res) => {
  const { error } = addUser(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let company;

  await Company.findById(req.params.id)
    .then((result) => {
      company = result;
    })
    .catch((error) => {
      return res.status(500).send(error.details[0].message);
    });

  let user;

  await User.updateOne(
    { email: req.body.email },
    { $push: { company: company } }
  )
    .then((result) => {
      if (result.n === 0)
        return res.status(404).send({ message: "User not found" });
      if (result.nModified === 0)
        return res.status(500).send({ message: "User not added" });
    })
    .catch((error) => {
      res.status(500).send(error.details[0].message);
    });

  res.send(company);
});

module.exports = router;
