var express = require('express');
const {deleteEvent,
    getEvents,
    createEvent} = require('../Controller/eventController');
var router = express.Router();

//Events
router.get("/events", getEvents);
router.post("/events", createEvent);
router.delete("/events", deleteEvent);

module.exports = router;