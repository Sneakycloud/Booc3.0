const express = require('express');
const router = require("./Router/usersRouter");
const app = express();
const PORT = 4000;

app.use("/api", router)

app.listen(PORT, () => {
  console.log(`Started "Users" microservice on port ${PORT}`);
});
