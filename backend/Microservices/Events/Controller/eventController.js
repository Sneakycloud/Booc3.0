const { 
    createEvent: createEventModel, 
    deleteEventModel, 
    checkIfCreator, 
    getEvents 
} = require('../Model/eventModel');

// Helper function to map invitePeople data
function inviteToObject(array) {
    return { username: array[0], identifier: array[1] };
}

// Get all events of a user
async function getEventsByUser(req, res) {
    try {
        const { username, identifier } = req.query;
        const result = await getEvents(username, identifier);
        return res.status(200).send({ events: result });
    } catch (err) {
        console.log("Failed to get events", err);
        return res.status(500).send({ msg: "Failed to get events" });
    }
}

// Create an event
async function createEvent(req, res) {
    try {
        const {title, date, fromTime, toTime, location, description, color, repeat, visibility, invitePeople } = req.body;

        const createdBy = req.jwt.payload;  // Extracted from JWT payload
        const mappedInvite = invitePeople.map(inviteToObject); // Transform array into object

        const result = await createEventModel(
            title, date, fromTime, toTime, location, description, color, repeat, visibility, mappedInvite, createdBy
        );

        if (result) {
            for (const { username, identifier } of invitePeople) {
            }
            return res.status(201).send({ event: result });
        } else {
            return res.status(400).send({ msg: "Failed to create event" });
        }
    } catch (err) {
        return res.status(500).send({ msg: "Failed to create event" });
    }
}

// Delete an event
async function deleteEvent(req, res) {
    try {
        const { _id } = req.body;

        // Check if the user is the creator of the event
        //const isEventCreator = await checkIfCreator(_id, req.jwt.payload.username, req.jwt.payload.identifier);
        //if (!isEventCreator) {
        //    return res.status(403).send({ msg: "User does not have the authority to delete this event" });
        //}

        const result = await deleteEventModel(_id);
        if (result === null) {
            return res.status(500).send({ msg: "Couldn't delete event" });
        }

        return res.status(200).send({ msg: "Event deleted" });
    } catch (err) {
        return res.status(500).send({ msg: "Failed to delete event" });
    }
}

// Get events for a user
async function getUserEvents(req, res) {
    try {
        const {username, identifier} = req.query;
        const result = await getEvents(username, identifier);
        if (result === null) {
            return res.status(500).send({ msg: "Failed to get events" });
        }
        return res.status(200).send({ events: result });
    } catch (err) {
        return res.status(500).send({ msg: "Failed to get events" });
    }
}

module.exports = {
    createEvent,
    deleteEvent,
    getUserEvents,
    getEventsByUser
};

