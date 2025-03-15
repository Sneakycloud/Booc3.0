
const eventModel = require('../Model/eventModel');
const {createEvent:createEventModel,
        deleteEventModel,
        checkIfCreator,
        getEvents:getEventsModel} = eventModel;
const jwt = require('jwt-express');  
const {eventsMsApi} = require("../AxiosTemplate/AxiosEventMs.js"); 

const axios = require('axios');

function inviteToObject(array){
    return {username:array[0], identifier:array[1]};
}
const { sendToSocket, getSocket } = require("../Model/io_socket");

//create event
async function createEvent(req, res){
    console.log("Creat an event starting");
    const { body: { title, date, fromTime, toTime, location, description, color, repeat, visibility, invitePeople } } = req;
    const createdBy = req.jwt.payload;
    const mappedInvite = invitePeople.map(inviteToObject); //Transforms the [[]] to [{}]
    console.log("Before the post function");
    const result = await eventsMsApi().post(`api/event`,{
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
        createdBy: createdBy
    });
    console.log("The result from the eventMsApi: ", result);
    console.log("The res: ", res);
    if (result)
    {
        //Send notification to all group members
        for(const {username, identifier} of invitePeople){
            const emitted_obj = {Type:"Create group", Cause:`${req.jwt.payload.username}#${req.jwt.payload.identifier}`,}
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
    console.log(_id);
    //check if the user is the creator of the event
    try {
        const isEventCreator = await checkIfCreator(_id, req.jwt.payload.username, req.jwt.payload.identifier);
        
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
    const result = await eventsMsApi().delete(`/api/event`,
        {date: {
            id: _id
        }});

    if (result === null)
    {
        return res.status(500).send({msg:"Couldn't Delete Event"});     // 500 error
    }
    
    return res.status(200).send({msg:"Event Deleted"});              // 200 OK
}

// Get users events
async function getEvents(req, res){
    try{
        var uName = req.jwt.payload.username;
        var uId = req.jwt.payload.identifier;
        
        var result = await eventsMsApi().get(`/api/event`,
            {params: {
                username: uName, 
                identifier: uId
            }});
        //console.log(`I controller så ser result ut såhär`, result);
        if (result === null) {
            console.log("Failed to get events");
            return res.status(500).send({msg:"Failed to get events"});
        }
        return res.status(200).send({msg:"Got group", group:result.data.events});
    }
    catch(err){
        console.log("Failed to get events");
        console.log(err);
        return res.status(500).send({msg:"Failed to get events"});
    }
    
}

module.exports = {
    createEvent,
    deleteEvent,
    getEvents
}
