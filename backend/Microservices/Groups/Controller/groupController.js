const {getGroup:getGroupModel, 
    getAllGroups:getAllGroupsModel,
    createGroup:createGroupModel,
    updateGroup:updateGroupModel,
    deleteGroup:deleteGroupModel,
    leaveGroup:leaveGroupModel,
    checkIfOwner} =  require("../model/groupModel");
//const { sendToSocket, getSocket } = require("../model/io_socket");

function inviteToObject(array){
    return {username:array[0], identifier:array[1]};
}

//Get info about group for recreating form
async function getGroup(req, res){
    //Gets info
    const {groupname} = req.body;
    var result = await getGroupModel(groupname);
    // if(result === null){
    //     return res.status(500).send({msg:"Failed to get group"});
    // }
    return res.status(200).send({group:result});
}

//Get all groups a person is in
async function getAllGroups(req, res){
    try{
        const {username, identifier} = req.body
        var result = await getAllGroupsModel(username, identifier);
        return res.status(200).send({groups:result});
    }
    catch{
        return res.status(500).send({msg:"Failed to get groups"});
    }
}

//Create group
async function createGroup(req, res){
    try{
        const{groupname, owner, members} = req.body;
        var result = await createGroupModel(groupname, owner, members);
        return res.status(200).send({group:result});
    }
    catch{
        return res.status(500).send({msg:"Failed to create group"});
    }
    
}  

//Update group
async function updateGroup(req, res){
    //Update group
    try{
        const {curentgroup, groupname, owners, members, username, identifier} = req.body;
        var result = await updateGroupModel(curentgroup, groupname, owners, members, username, identifier);
        if(result === null){
            return res.status(500).send({msg:"Failed to update group"});
        }

        return res.status(200).send({group:result});
    }
    catch(err){
        console.log("Failed to update");
        throw err;
    }
}

//Delete group
async function deleteGroup(req, res){
    // const {body : {groupName}} = req
    // try{
    //     if((await checkIfOwner(groupName, req.session.user.username, req.session.user.identifier)) === null){
    //         console.log("User does not have the authority to delete group")
    //         return res.status(403).send({msg:"User does not have the authority to delete group"});
    //     }
    // }
    // catch(err){
    //     console.log("Failed to check if the user had authority to delete");
    //     console.log(err);
    //     return res.status(500).send({msg:"Failed to check if the user had authority to delete"});
    // }
    
    //Get group
    //var members = await getGroupModel(groupName).members;

    //delete group
    const {groupname} = req.body;
    var result = await deleteGroupModel(groupname);
    if(result === null){
        return res.status(500).send({msg:"Failed to delete group"});
    }

    //Send notification to all group members
    //for(const {username, identifier} of members){
    //    const emitted_obj = {Type:"Delete group", Cause:`${req.session.user.username}#${req.session.user.identifier}`,}
    //    await sendToSocket((await getSocket(username, identifier)), emitted_obj, req);
    //}
    //sendToSocket(null, null, req) //-------------------------------------------------------------------------------------------------------Delete this when sendToSocket works

    return res.status(200).send({group:result});
}

//Takes groupname and if the user is in it then leave
async function leaveGroup(req, res) {
    try{
        const {body : {groupName}} = req;
        var result = await leaveGroupModel(groupName, req.session.user.username, req.session.user.identifier);
        if(result === null){
            return res.status(500).send({msg:"Failed leave group"});
        }
        
        //delete group if empty
        const groupState = (await getGroupModel(groupName))?.owners[0];
        console.log("Group state:", groupState);
        if(!(groupState?.username) || !(groupState?.identifier)){
            var result = await deleteGroupModel(groupName);
            if(result === null){
                //sendToSocket(null, null, req) //-------------------------------------------------------------------------------------------------------Delete this when sendToSocket works
                return res.status(200).send({msg:"Left group"});
            }
        }
        
        //sendToSocket(null, null, req) //-------------------------------------------------------------------------------------------------------Delete this when sendToSocket works

        /*
        var members = getGroup(groupName).members;

        //Send notification to all group members
        for(const {username, identifier} of members){
            const emitted_obj = {Type:"Left group", Cause:`${req.session.user.username}#${ req.session.user.identifier}`,}
            await sendToSocket((await getSocket(username, identifier)), emitted_obj, req);
        }
            */
        
        return res.status(200).send({msg:"Left group"});
    }
    catch(err){
        console.log(err);
        return res.status(500).send({msg:"Failed leave group"});
    }
}


module.exports = {
    getGroup,
    getAllGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    leaveGroup
}