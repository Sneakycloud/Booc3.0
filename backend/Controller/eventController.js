
const eventModel = require('../Model/eventModel');
const {createEvent:createEventModel,
        deleteEventModel,
        checkIfCreator} = eventModel;
        
const axios = require('axios');

function inviteToObject(array){
    return {username:array[0], identifier:array[1]};
}
const { sendToSocket, getSocket } = require("../Model/io_socket");

//create event
async function createEvent(req, res){

    const { body: { title, date, fromTime, toTime, location, description, color, repeat, visibility, invitePeople } } = req;
    const createdBy = req.session.user;
    const mappedInvite = invitePeople.map(inviteToObject); //Transforms the [[]] to [{}]

    //const result = await createEventModel(title, date, fromTime, toTime, location, description, color, repeat, visibility, mappedInvite, createdBy);

    //uses axios to send data to the user microservice
    const result = await axios.post(`http://localhost:5000/api/events`, 
        {
            title: title, 
            date: date, 
            fromTime: fromTime, 
            toTime: toTime, 
            location: location, 
            description: description, 
            color: color, 
            repeat: repeat, 
            visibility: visibility, 
            mappedInvite: mappedInvite, 
            createdBy: createdBy,
        },   
    );


    if (result)
    {
        //Send notification to all group members
        for(const {username, identifier} of invitePeople){
            const emitted_obj = {Type:"Create group", Cause:`${req.session.user.username}#${req.session.user.identifier}`,}
            await sendToSocket((await getSocket(username, identifier)), emitted_obj, req);
        }
        return res.status(201).send({result});                          // 201 Created
    }
    else
    {
        return res.status(400).send({msg:"Failed to create event"});    // 400 Bad Request
    }
}



//delete event
async function deleteEvent(req, res) {

    const { body: { _id } } = req;


    //check if the user is the creator of the event
    try {

        //const isEventCreator = await checkIfCreator(_id, req.session.user.username, req.session.user.identifier);
       
        //uses axios to send data to the user microservice
        const result = await axios.get(`http://localhost:5000/api/events`, 
            {data: {
                email: req.session.user.username,
                identifier: req.session.user.identifier,
            }},   
        );

        console.log("Event creator:", isEventCreator);


        if (isEventCreator === null)
        {
            console.log("User does not have the authority to delete this event");
            return res.status(403).send({ msg: "User does not have the authority to delete this event"});       // 403 forbidden
        }

    } catch (error) {
        console.log("Failed to check if user is the event creator", error);
        return res.status(500).send({ msg: "Failed to check if user is the event creator"});
    }
    //Get event
    //invited people:
    
    //delete the event
    //const result = await deleteEventModel(_id);

    //uses axios to send data to the user microservice
    const result = await axios.delete(`http://localhost:5000/api/events`, 
        {data: {
          id: _id,
        }},   
    );

    if (result === null)
    {
        return res.status(500).send({msg:"Couldn't Delete Event"});     // 500 error
    }
    
    return res.status(200).send({msg:"Event Deleted"});              // 200 OK
}




























// Get users events
//async function getEvents(req, res){
//    try{
//        var uName = req.session.user.username;
//        var uId = req.session.user.identifier;
//
//        // var result = await eventModel.getEvents(uName, uId);
//
//        //uses axios to retrive data from the user microservice
//        var result = await axios.get(`http://localhost:5000/api/events`, 
//            {params: {
//                username: uName,
//                identifier: uId,
//        }});
//
//        //console.log(`I controller så ser result ut såhär`, result);
//        if (result === null) {
//            console.log("Failed to get events");
//            return res.status(500).send({msg:"Failed to get events"});
//        }
//        return res.status(200).send({msg:"Got group", group:result});
//    }
//    catch(err){
//        console.log("Failed to get events");
//        console.log(err);
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
    getEvents
};



























module.exports = {
    createEvent,
    deleteEvent,
    getEvents
}
