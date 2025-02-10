const usersModel = require('../model/usersModel.js');

const axios = require('axios');

//Get user info
async function getCurrentUser(req, res){
    try{
        //Test if user exists
        if(!req.session.user){return res.status(401).send({msg:"Cannot find session"})}

        //Updates user session before returning it
        //uses axios to retrive data from the user microservice
        const response = await axios.get(`http://localhost:4000/api/users`, 
            {params: {
                username: req.session.user.username,
                identifier: req.session.user.identifier,
        }});
        if(response.data.user == "") res.status(500).send({msg:"Failed to get current user"});
        req.session.user = {id:req.session.id, ...response.data.user, password:req.session.user.password, socket:req.session.socket};

        //Returns user session
        if(!req.session.user){
            return res.status(401).send({msg:"Not authenticated"})
        }
        return res.status(200).send(req.session.user);
    }
    catch(err){
        console.log("got to here 2");
        console.log(err);
        return res.status(500).send({msg:"Failed to get current user"});
    }
}

//Create user
async function createUser(req, res){
    const {body: {email, username, password}} = req;
    const result = await usersModel.createUser(email, username, password);
    if(result === "All identifiers used"){
        return res.status(500).send({msg:"All identifiers used for this username"});
    }
    //console.log(result);
    if(typeof result !== "undefined"){
        req.session.user = {id:req.session.id, ...result, password:password, socket:req.session.socket};
        return res.status(200).send({msg:"Created user"});
    }
    else{
        return res.status(500).send({msg:"Failed to create user"});
    }
}


async function changeStartPage(req, res) {
    const result = await usersModel.changeStartPage(req.session.user.email, req.session.user.password, req.body.startPage);
    if(result){
        return res.status(200).send({msg:"Changed start page"});
    }
    else{
        return res.status(500).send({msg:"Failed to change start page"});
    }
}


async function changePassword(req, res) {
    const result = await usersModel.changePassword(req.session.user.email, req.session.user.password, req.body.password);
    if(result){
        //Change the session to be the new password
        req.session.user.password = req.body.password;

        return res.status(200).send({msg:"Changed users password"});
    }
    else{
        return res.status(500).send({msg:"Failed to change password"});
    }
}


async function deleteUser(req, res) {
    try{
        const result = await usersModel.deleteUser(req.session.user.email, req.session.user.password);

        if(result){
            return res.status(200).send({msg:"Deleted user"});
        }
        else{
            return res.status(500).send({msg:"Failed to delete user"});
        }
    }
    catch(err){
        console.log("Failed to delete user");
        console.log(err);
        return res.status(500).send({msg:"Failed to delete user"});
    }
}





module.exports = {
    getCurrentUser,    
    createUser,
    deleteUser,
    changeStartPage,
    changePassword,
}