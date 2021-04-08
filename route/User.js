const { User, validateLogin, validateUser } = require("../models/User");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("Everything is alright");
});

module.exports = router;
