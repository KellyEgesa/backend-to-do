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

  res.send(req.user);
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
      res.send(error.details[0].message);
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

router.put("/user/:id", auth, (req, res) => {
  const { error } = addUser(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
});

module.exports = router;
