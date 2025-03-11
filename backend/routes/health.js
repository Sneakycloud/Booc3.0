var express = require('express');
var router = express.Router();

const health = require("../Controller/healthController");

router.get("/started", health.started);
router.get("/ready", health.ready);
router.get("/alive", health.alive);

module.exports = router;