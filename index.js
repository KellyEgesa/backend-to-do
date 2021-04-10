const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

const User = require("./route/User");
const Company = require("./route/Company");

mongoose
  .connect("mongodb://localhost/to-do", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`Connected to mongodb at ${new Date()}`);
  });

app.use(cors());
app.use(express.json());
app.use("/api/user", User);
app.use("/api/company", Company);

app.listen(port, () => console.log(`Listening to port ${port}`));
