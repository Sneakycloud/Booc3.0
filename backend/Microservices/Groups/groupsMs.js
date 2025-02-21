const express = require('express');
require('dotenv').config({ path: require('find-config')('.env') })
const router = require("./Router/groupsRouter");
const app = express();
const PORT = 8080;

app.use(express.json());

app.use(function(req, res, next) {
    //console.log(req);
    next();
});

app.use("/api", router)

app.listen(PORT, () => {
  console.log(`Started "Users" microservice on port ${PORT}`);
});