const eventModel = require('../Model/eventModel');
const {createEvent:createEventModel,
        deleteEventModel,
        checkIfCreator} = eventModel;        


function inviteToObject(array){
    return {username:array[0], identifier:array[1]};
}
//const { sendToSocket, getSocket } = require("../Model/io_socket");

//create event
async function createEvent(req, res){
    try{

        const { body: { title, date, fromTime, toTime, location, description, color, repeat, visibility, invitePeople } } = req;
        const createdBy = req.session.user;
        const mappedInvite = invitePeople.map(inviteToObject); //Transforms the [[]] to [{}]

        const result = await createEventModel(title, date, fromTime, toTime, location, description, color, repeat, visibility, mappedInvite, createdBy);
        return res.status(201).send({result});                          // 201 Created
    }
    catch{
        return res.status(400).send({msg:"Failed to create event"});    // 400 Bad Request
    }
}



//delete event
async function deleteEvent(req, res) {

    const { body: { _id } } = req;


    //check if the user is the creator of the event
    try {

        const isEventCreator = await checkIfCreator(_id, req.session.user.username, req.session.user.identifier);

        console.log("Event creator:", isEventCreator);


    } catch (error) {
        console.log("Failed to check if user is the event creator", error);
        return res.status(500).send({ msg: "Failed to check if user is the event creator"});
    }
    //Get event
    //invited people:
    
    //delete the event
    const result = await deleteEventModel(_id);
    
    return res.status(200).send({msg:"Event Deleted"});              // 200 OK
}






















//// Get users events
//async function getEvents(req, res){
//    try{
//        var uName = req.session.user.username;
//        var uId = req.session.user.identifier;
//
//        var result = await eventModel.getEvents(uName, uId);
//        return res.status(200).send({msg:"Got group", group:result});
//    }
//    catch{
//        return res.status(500).send({msg:"Failed to get events"});
//    }
//    
//}

async function getEvents(req, res) {
    try {
        // Log incoming request parameters
        const { username, identifier } = req.query;
        console.log("Received request for events with:", req.query);

        // Check if the required query parameters are present
        if (!username || !identifier) {
            console.error("Missing required query parameters.");
            return res.status(400).json({ msg: "Bad Request: Missing username or identifier" });
        }

        // Simulate event fetching from the database (replace this with actual database logic)
        const events = await eventModel.getEvents(username, identifier);
        console.log("Database response:", events);  // Log the events retrieved from the DB

        // If no events are found, return a 404
        if (!events || events.length === 0) {
            console.warn("No events found for user:", username);
            return res.status(404).json({ msg: "No events found" });
        }

        // Send the response with the events
        return res.status(200).json(events);
    } catch (err) {
        // Log the error if something fails
        console.error("Error fetching events:", err);
        return res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
}
























module.exports = {
    createEvent,
    deleteEvent,
    getEvents
}
