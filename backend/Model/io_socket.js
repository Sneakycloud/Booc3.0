const { startMongodb } = require('./mongodbStarter.js');
const { io } = require('../app.js');

//Send to socket
async function sendToSocket(socket_id, sending_obj, req){
    try{
        const socket = req.app.io;
        //if(!socket_id){throw Error("Socket does not exist")}; -----------------------------Remove this at the same time as the one below
        //socket.to(socket_id).emit("sendingObj", sending_obj);
        socket.emit("sendingObj", sending_obj); //---------------------------------------------Remove this
        console.log("Emited");
    }
    catch(err){
        console.log("Failed to send to socket: ", socket_id);
        console.log(err);
        return;
    }
}


//Get socket id for user using username, identifier
async function getSocket(username, identifier) {
    return null; //-------------------------------------------------------Remove and fix this

    try{
       const client = startMongodb();
        await client.connect();
        const db = client.db("Booc");
        const col = db.collection("mySessions");
        
        //Gets session with username and identfier
        console.log("Trying to find socketID for", username, identifier);
        //const userToFind = {username:username, identifier:identifier};
        const findUser = (await col.find({
            $and: [
                {"session.user.username":username},
                //{"session.user.identifier":identifier},
            ]
            
            //"session": {"user":{"username":username}}, 
            //"session": {"user":{"identifier":identifier}}
        }).toArray());
        //console.log("findUser", findUser);
        //console.log("Found username: ", findUser[0]);
        const foundUser = findUser[0].session.user.id;
        console.log("Found username: ", foundUser);

        if(!foundUser || foundUser == null){return "Failed to find session"};
        console.log("found socket_id:", foundUser);
        return foundUser; 
    }
    catch(err){
        console.log(err);
        return undefined;
    }
    
}


module.exports = {sendToSocket, getSocket}