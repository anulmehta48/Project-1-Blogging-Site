const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./router/route");
require("dotenv").config();
app.use(express.json());

const DB_USER = process.env.DB_USER;
mongoose
  .connect(DB_USER)
  .then(() => {
    console.log("MongoDB is Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", router);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express is running on port " + (process.env.PORT || 3000));
});


