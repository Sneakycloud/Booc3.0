const usersModel = require('../Model/usersModel.js');
const axios = require('axios');
const jwt = require('jwt-express');

//Get user info
async function getCurrentUser(req, res){
    try{
        //Test if user exists
        if(!req.jwt.payload){return res.status(401).send({msg:"Cannot find session"})}

        //Updates user session before returning it
        //uses axios to retrive data from the user microservice
        const response = await axios.get(`http://users-microservice/api/users`, 
            {params: {
                username: req.jwt.payload.username,
                identifier: req.jwt.payload.identifier,
        }});
        if(response.data.user == "" || response.data.msg == "Failed to get current user") res.status(500).send({msg:"Failed to get current user"});
        const refreshed_user = {id:req.jwt.payload._id, ...response.data.user, password:req.jwt.payload.password, socket:req.jwt.payload?.socket};
        const token = (jwt.create(process.env.SESSION_SECRET, refreshed_user)).token;

        //Returns user session
        if(!refreshed_user){
            return res.status(401).send({msg:"Not authenticated"})
        }
        return res.status(200).send({user:refreshed_user, token});
    }
    catch(err){
        console.log(err);
        return res.status(500).send({msg:"Failed to get current user"});
    }
}

//Create user
async function createUser(req, res){
    try{
        const {body: {email, username, password}} = req;
        //uses axios to send data to the user microservice
        const result = await axios.post(`http://users-microservice/api/users`, 
            {
                email: email,
                username: username,
                password: password,
            },   
        );

        if(result.data.user == "" || result.data.msg == "Failed to create user") res.status(500).send({msg:"Failed to create user"});

        if(result.data.user === "All identifiers used"){
            return res.status(500).send({msg:"All identifiers used for this username"});
        }
        //console.log(result);
        if(typeof result.data.user !== "undefined"){
            const new_user = {id:req.jwt.payload._id, ...result.data.user, password:password, socket:req.jwt.payload?.socket};
            const token = (jwt.create(process.env.SESSION_SECRET, {something})).token;
            return res.status(200).send({msg:"Created user", token});
        }
        else{
            return res.status(500).send({msg:"Failed to create user"});
        }
    }
    catch{
        console.log("Failed to create user because of err");
        return res.status(500).send({msg:"Failed to create user"});
    }

}


async function changeStartPage(req, res) {
    try{
        //uses axios to send data to the user microservice
        const result = await axios.put(`http://users-microservice/api/users`, 
            {
                email: req.jwt.payload.email,
                password: req.jwt.payload.password,
                startPage: req.body.startPage
            },   
        );

        if(result.data.result){
            return res.status(200).send({msg:"Changed start page"});
        }
        else{
            return res.status(500).send({msg:"Failed to change start page"});
        }
    }
    catch{
        return res.status(500).send({msg:"Failed to change start page"});
    }
    
}


async function changePassword(req, res) {
    try{
        //uses axios to send data to the user microservice
        const result = await axios.put(`http://users-microservice/api/password`, 
            {
                email: req.jwt.payload.email,
                password: req.jwt.payload.password,
                newPassword: req.body.password
            },   
        );

        if(result.data.result){
            //Change the session to be the new password
            req.jwt.payload.password = req.body.password;
            const token = (jwt.create(process.env.SESSION_SECRET, req.jwt.payload)).token;

            return res.status(200).send({msg:"Changed users password", token});
        }
        else{
            return res.status(500).send({msg:"Failed to change password"});
        }
    }
    catch{
        return res.status(500).send({msg:"Failed to change password"});
    }

    
}


async function deleteUser(req, res) {
    try{
        //uses axios to send data to the user microservice
        const result = await axios.delete(`http://users-microservice/api/users`, 
            {data: {
                email: req.jwt.payload.email,
                password: req.jwt.payload.password,
            }},   
        );

        console.log(result);
        if(result.data?.result){
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