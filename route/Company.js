const express = require("express");
const auth = require("../middleware/Auth");
const { validateCompany, Company } = require("../models/Company.Js");

const router = express.Router();

router.post("/create", auth, async (req, res) => {
  const { error } = validateCompany(req.body);
  if (error)
    res.status(400).send({
      message: error.details[0].message,
    });

  let company = new Company({
    name: req.body.name,
    companyLogo: req.body.companyLogo,
    editor: req.body.editor,
  });

  const saved = await company.save();
  return res.send(saved);
});

module.exports = router;
