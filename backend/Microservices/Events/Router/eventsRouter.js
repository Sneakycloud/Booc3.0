var express = require('express');
const { createEvent, 
    deleteEvent, 
    getUserEvents } = require('../Controller/eventController');
var router = express.Router();

router.get("/event", getUserEvents);
router.post("/event", createEvent);
router.delete("/event", deleteEvent);

module.exports = router;