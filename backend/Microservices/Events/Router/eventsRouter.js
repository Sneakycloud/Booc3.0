var express = require('express');
const { createEvent, 
    deleteEvent, 
    getEvents } = require('../Controller/eventController');
var router = express.Router();

router.post("/event", createEvent);
router.delete("/event", deleteEvent);
router.get("/events", getEvents);

module.exports = router;