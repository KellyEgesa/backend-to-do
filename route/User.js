const { User, validateLogin, validateUser } = require("../models/User");
const mongoose = require("mongoose");
const { sendEmail } = require("../email/email");

const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("../middleware/Auth");

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

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

  sendEmail(
    newUser.email,
    "Confirmation of email to the ratiba app platform",
    "<h1>Confirmation of email to the ratiba app platform</h1>"
  )
    .then((result) => console.log("Email sent", result))
    .catch((error) => {
      console.log(error.message);
    });

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
  const validId = ObjectId.isValid(req.params.id);

  if (!validId)
    return res.status(404).send({
      message: "Invalid parameters",
    });

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
      });

    res.send({ user: user, message: "Confirmed " });
  } catch (error) {
    return res.status(400).send({ message: "Something went wrong" });
  }
});

router.get("/retrieve/:id", auth, async (req, res) => {
  const validId = ObjectId.isValid(req.params.id);

  if (!validId)
    return res.status(404).send({
      message: "Invalid parameters",
    });

  const user = await User.findById(req.params.id).select("-password");

  if (!user) return res.status(404).send({ message: "User not found" });

  return res.send(user);
});

module.exports = router;
