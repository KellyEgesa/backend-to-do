const express = require("express");
const { Router } = require("express");
const auth = require("../middleware/Auth");
const { validateCompany, Company } = require("../models/Company.Js");

const router = express.Router();

router.post("/create", auth, async (req, res) => {
  const { error } = validateCompany(req.body);
  if (error)
    res.status(400).send({
      message: error.details[0].message,
    });

  res.send("Succes");
});

module.exports = router;
