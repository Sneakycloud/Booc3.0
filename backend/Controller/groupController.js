const {getGroup:getGroupModel, 
    getAllGroups:getAllGroupsModel,
    createGroup:createGroupModel,
    updateGroup:updateGroupModel,
    deleteGroup:deleteGroupModel,
    leaveGroup:leaveGroupModel,
    checkIfOwner} =  require("../Model/groupModel");

const { sendToSocket, getSocket } = require("../model/io_socket");
const {groupsMsApi} = require("../AxiosTemplate/AxiosGroupMs.js");

const jwt = require('jwt-express');

//const axios = require('axios');

function inviteToObject(array){
    return {username:array[0], identifier:array[1]};
}


//Get info about group for recreating form
async function getGroup(req, res){
    //Gets info
    const groupName = req.session.groupName;
    //var result = await getGroupModel(groupName);
    const response = await groupsMsApi().get(`/api/group`,
        {params: {
            groupname: groupName,
    }});
    if(response.data.group === null){
        return res.status(500).send({msg:"Failed to get group"});
    }
    return res.status(200).send({msg:"Got group", group:result});

}

//Get all groups a person is in
async function getAllGroups(req, res){
    try{

        //var result = await getAllGroupsModel(req.session.user.username, req.session.user.identifier);
        const response = await groupsMsApi().get(`/api/groups`,
            {params: {
                username: req.session.user.username,
                identifier: req.session.user.identifier
        }});
        
        if(response.data.user === null){

            return res.status(500).send({msg:"Failed to get groups"});
        }
        return res.status(200).send({msg:"Got groups", groups: response.data.groups});
    }
    catch{
        return res.status(500).send({msg:"Failed to get groups"});
    }
}

//Create group
async function createGroup(req, res){
    const {body : {groupName, members}} = req;
    try{
        
        if(!groupName || groupName == ""){
            console.log("There was an attempt to create a group with an empty name");
            return res.status(500).send({msg:"Failed to create group"});
        }
        const owner = [{username:req.jwt.payload.username, identifier:req.jwt.payload.identifier}];
        const memberObjectArray = members.map(inviteToObject);
        //var result = await createGroupModel(groupName, owner, memberObjectArray);
        const result = await groupsMsApi().post(`/api/group`,
            {
                groupname: groupName,
                owner: owner,
                members: memberObjectArray
        });
        
        if(result === null){
            return res.status(500).send({msg:"Failed to create group"});
        }

        //Send notification to all group members
        for(const {username, identifier} of members){
            const emitted_obj = {Type:"Create group", Cause:`${owner.username}#${owner.identifier}`,}
            await sendToSocket((await getSocket(username, identifier)), emitted_obj, req);
        }
        
        

        return res.status(200).send({msg:"Created group"});
    }
    catch{
        return res.status(500).send({msg:"Failed to create group"});
    }
    
}  

//Update group
async function updateGroup(req, res){
    try{
        const {body : {currentGroupName, groupName, owners, members}} = req
        console.log("Current:",currentGroupName);
        console.log("GroupName:",groupName);
        console.log("Owners:", owners);
        console.log("Members", members);
        try{
            if(!groupName || groupName == ""){
                console.log("There was an attempt to update a group with an empty name");
                return res.status(500).send({msg:"Failed to update"});
            }

            const isOwner = await checkIfOwner(currentGroupName, req.session.user.username, req.session.user.identifier);
            if(isOwner === null){

                return res.status(403).send({msg:"User does not have the authority to update group"});
            }
        }
        catch(err){
            console.log("Failed to check if the user had authority to delete");
            console.log(err);
        }
        //Update group
        try{

            //var result = await updateGroupModel(currentGroupName, groupName, owners, members, {username:req.session.user.username, identifier:req.session.user.identifier});
            var result = await groupsMsApi().put(`/api/group`,
                {
                    currentGroup: currentGroupName,
                    groupName: groupName,
                    owners: owners,
                    members: members,
                    username: req.session.user.username,
                    identifier: req.session.user.identifier
                
            });
            // if(!result || !result.data.group){
            //     return res.status(500).send({msg:"Failed to update group"});
            // }
            console.log("Check the result : ", result.data);
            // //Send notification to all group members
            // for(const {username, identifier} of [...result.members, members]){
            //     const emitted_obj = {Type:"Update group", Cause:`${req.session.user.username}#${req.session.user.identifier}`,}
            //     await sendToSocket((await getSocket(username, identifier)), emitted_obj, req);
            // }

            // //Send notification to new owner
            // for(const {username, identifier} of [...result.owners, {username:req.session.user.username, identifier:req.session.user.identifier}]){
            //     const emitted_obj = {Type:"Update group", Cause:`${req.session.user.username}#${req.session.user.identifier}`,}
            //     await sendToSocket((await getSocket(username, identifier)), emitted_obj, req);
            // }


            return res.status(200).send({msg:"Updated group"});
        }
        catch(err){
            console.log("Failed to update");
            throw err;
        }
    }
    catch(err){
        //console.log(err);
        return res.status(500).send({msg:"Failed to update group"});
    }
    
    
}

//Delete group
async function deleteGroup(req, res){
    const {body : {groupName}} = req;
    try{

        console.log("HERE, BUT NO FURTHUR");
        if((await checkIfOwner(groupName, req.session.user.username, req.session.user.identifier)) === null){

            console.log("User does not have the authority to delete group")
            return res.status(403).send({msg:"User does not have the authority to delete group"});
        }
        console.log("WHY STOP HERE?");
    }
    catch(err){
        console.log("Failed to check if the user had authority to delete");
        //console.log(err);
        return res.status(500).send({msg:"Failed to check if the user had authority to delete"});
    }
    console.log("YOU MADE IT THIS FAR");
    
    //Get group
    //var members = await getGroupModel(groupName).members;
    // const members = await axios.get(`http://localhost:8080/api/groups`,
    //     {
    //         groupname: groupName,
    // });

    //delete group
    //var result = await deleteGroupModel(groupName);
    const result = await groupsMsApi().delete(`/api/group`,
        {data: {
            groupname: groupName,
        }
    });
    console.log("AND NOW YOU'RE HERE");
    if(result === null){
        return res.status(500).send({msg:"Failed to delete group"});
    }

    //Send notification to all group members
    //for(const {username, identifier} of members){
    //    const emitted_obj = {Type:"Delete group", Cause:`${req.jwt.payload.username}#${req.jwt.payload.identifier}`,}
    //    await sendToSocket((await getSocket(username, identifier)), emitted_obj, req);
    //}
    sendToSocket(null, null, req) //-------------------------------------------------------------------------------------------------------Delete this when sendToSocket works

    return res.status(200).send({msg:"Deleted group"});
}

//Takes groupname and if the user is in it then leave
async function leaveGroup(req, res) {
    try{
        const {body : {groupName}} = req;

        //var result = await leaveGroupModel(groupName, req.session.user.username, req.session.user.identifier);
        const result = await groupsMsApi().delete(`/api/groups`,
            {data: {
                groupName: groupName,
                username: req.session.user.username,
                identifier: req.session.user.identifier
            }
        });

        if(result === null){
            return res.status(500).send({msg:"Failed leave group"});
        }
        
        //delete group if empty
        // const groupResponse = (await axios.get(`http://localhost:8080/api/group`,
        //     {params: {
        //         groupName: groupName
        //     }
        // }));
        // console.log("Group state response:", groupResponse.data);

        // const groupState = groupResponse.data?.owners?.[0];


        // console.log("Group state:", groupState);
        // if(!(groupState?.username) || !(groupState?.identifier)){
            
        //     const deleteResult = await axios.delete(`http://localhost:8080/api/group`,
        //         {data: {groupName: groupName}
        //     });

        //     if(deleteResult === null){
        //         sendToSocket(null, null, req) //-------------------------------------------------------------------------------------------------------Delete this when sendToSocket works
        //         return res.status(200).send({msg:"Left group"});
        //     }
        // }
        
        // sendToSocket(null, null, req) //-------------------------------------------------------------------------------------------------------Delete this when sendToSocket works

        
        return res.status(200).send({msg:"Left group"});
    }
    catch(err){
        console.error("Error in GET request for group state:", err.response ? err.response.data : err.message);
        // console.log(err);
        return res.status(500).send({msg:"Failed leave group", error: err.message });
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