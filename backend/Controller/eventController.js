
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

async function getEvents(req, res) {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).send({ msg: "Unauthorized: No session found" });
        }

        var uName = req.session.user.username;
        var uId = req.session.user.identifier;

        //console.log(`Fetching events for: ${uName}, ${uId}`);

        const result = await axios.get("http://localhost:5000/api/events", {
            params: { username: uName, identifier: uId },
        });

        if (!result || result.status !== 200) {
            console.log("Failed to get events, bad response");
            return res.status(500).send({ msg: "Failed to get events" });
        }

        return res.status(200).send({ msg: "Got group", group: result.data });
    } catch (err) {
        console.error("Failed to get events:", err.response ? err.response.data : err);
        return res.status(500).send({ msg: "Failed to get events", error: err.toString() });
    }
}

module.exports = {
    createEvent,
    deleteEvent,
    getEvents
}
