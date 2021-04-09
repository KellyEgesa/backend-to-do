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

  return res.send(saved);
});

router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error)
    return res
      .status(400)
      .send({ message: error.details[0].message, status: "failed" });

  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return res.status(404).send({
      message: "User doesnt exist, Kindly register first",
      status: "Not found",
    });

  if (!user.confirmed)
    return res.status(401).send({
      message: `Kindly confirm your email address at ${user.email} to login`,
    });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({
      message: "Wrong password",
    });

  const token = user.generateAuthToken();

  return res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({ user: user });
});

router.put("/confirm/:id", async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        confirmed: true,
      }
    ).select("-password");
    if (!user)
      return res.status(404).send({
        message: "User doesnt exist, Kindly register first",
        status: "Not found",
      });

    res.send({ user: user, message: "Confirmed " });
  } catch (error) {
    return res.status(400).send({ message: "Something went wrong" });
  }
});

module.exports = router;
