const usersModel = require('../model/usersModel.js');

const axios = require('axios');

//Get user info
async function getCurrentUser(req, res){
    try{
        //Test if user exists
        if(!req.session.user){return res.status(401).send({msg:"Cannot find session"})}

        //Updates user session before returning it
        //uses axios to retrive data from the user microservice
        const response = await axios.get(`users-microservice/api/users`, 
            {params: {
                username: req.session.user.username,
                identifier: req.session.user.identifier,
        }});
        if(response.data.user == "" || response.data.msg == "Failed to get current user") res.status(500).send({msg:"Failed to get current user"});
        req.session.user = {id:req.session.id, ...response.data.user, password:req.session.user.password, socket:req.session.socket};

        //Returns user session
        if(!req.session.user){
            return res.status(401).send({msg:"Not authenticated"})
        }
        return res.status(200).send(req.session.user);
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
        const result = await axios.post(`users-microservice/api/users`, 
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
            req.session.user = {id:req.session.id, ...result.data.user, password:password, socket:req.session.socket};
            return res.status(200).send({msg:"Created user"});
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
        const result = await axios.put(`users-microservice/api/users`, 
            {
                email: req.session.user.email,
                password: req.session.user.password,
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
        const result = await axios.put(`users-microservice/api/password`, 
            {
                email: req.session.user.email,
                password: req.session.user.password,
                newPassword: req.body.password
            },   
        );

        if(result.data.result){
            //Change the session to be the new password
            req.session.user.password = req.body.password;

            return res.status(200).send({msg:"Changed users password"});
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
        const result = await axios.delete(`users-microservice/api/users`, 
            {data: {
                email: req.session.user.email,
                password: req.session.user.password,
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