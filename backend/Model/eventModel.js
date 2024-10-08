const mongoose = require('mongoose');
const events = require("./schemas/eventSchema");
const users = require("./schemas/userSchema");
const {startmongoose} = require('./mongodbStarter');


//create event
async function createEvent(title, date, fromTime, toTime, location, description, color, repeat = 'never', visibility = 'private', invitePeople = [], createdBy)
{
    startmongoose();                                        //initialize the mongoose connection

    try{
        const currentUser = {
            username: createdBy.username,
            identifier: createdBy.identifier,
        }
        if (!currentUser) {
            return 0;
        }


        const newEvent = new events({
            title,
            date,
            fromTime,
            toTime,
            location,
            description,
            color,
            repeat,
            visibility,
            invitePeople,
            createdBy: currentUser    
        });
        
        

        await newEvent.save();                              //saves the event to the database
        return newEvent;                                    //success
    }
    catch (error) {
        console.error('Failed to create event:', error);    //logs the error
        return null;                                        //failed
    }
}




//delete event
async function deleteEvent(eventID){
    startmongoose();

    try {
        const event = await events.findById(eventID);
        if (!event) return 0;

        await event.deleteOne();
        return 1;
    }
    catch (error) {
        console.error('Failed to delete event:', error);
        return 0;
    }

}

// Get users events
async function getEvents(username, identifier){
    startmongoose();
    try {
        const user = {username, identifier};
        const event = await events.find({
            $or: [
                {"createdBy.username": username, "createdBy.identifier": identifier},
                { "invitePeople": { $elemMatch: { "username": username, "identifier": identifier } } },
            ]
        })
        .sort({ date: 1 });
        
        // if (event.length > 0) {
        //     console.log(`Hittade ${event.length} event(s) skapat av ${user.username}`);
        // } else {
        //     console.log(`Inga events under ${user.username}`);
        // }

        if (!Array.isArray(event) || !event.length) {
            console.log("No events returned, returning null");
            return null;
        }
        return event;
    }
    catch(error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    createEvent,
    deleteEvent,
    getEvents
}

