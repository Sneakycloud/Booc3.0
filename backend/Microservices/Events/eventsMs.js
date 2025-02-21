const express = require('express');
//const dotenv = require("dotenv").config(); 
require('dotenv').config({ path: require('find-config')('.env') })
const router = require("./Router/eventsRouter");
const app = express();
const PORT = 5000;

app.use(express.json());

app.use(function(req, res, next) {
  //console.log(req);
  next();
});

app.use("/api", router)

app.listen(PORT, () => {
  console.log(`Started "Events" microservice on port ${PORT}`);
});
