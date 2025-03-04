const express = require('express');
//const dotenv = require("dotenv").config(); 
require('dotenv').config({ path: require('find-config')('.env') })
const router = require("./Router/usersRouter");
var healthRouter = require("./Router/health");
const app = express();
const PORT = 4000;

app.use(express.json());

app.use(function(req, res, next) {
  //console.log(req);
  next();
});

app.use("/api", router)
app.use("/health", healthRouter);

app.listen(PORT, () => {
  console.log(`Started "Users" microservice on port ${PORT}`);
});
