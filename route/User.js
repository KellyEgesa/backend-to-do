const { User, validateLogin, validateUser } = require("../models/User");
const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error)
    return res
      .status(400)
      .send({ message: error.details[0].message, status: "failed" });

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send({
      message: "User already exists try logging in",
      status: "failed",
    });

  let newUser = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  const saved = await newUser.save();

  res.send(saved);
});

module.exports = router;
