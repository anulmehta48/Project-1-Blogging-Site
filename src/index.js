const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const DB_USER = process.env.DB_USER;
mongoose
  .connect(DB_USER)
  .then(() => {
    console.log("MongoDB is Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", function (req, res) {
  res.send({ Name: "Hello" });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Express is running on port " + (process.env.PORT || 3000));
});

