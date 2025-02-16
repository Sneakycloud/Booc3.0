const usersModel = require('../Model/usersModel.js');
const axios = require('axios');

//Checks if the given credentials are a valid login.
async function authenicate(req, res){
    try{
        //Extract parameters from req
        const {body: {email, password}} = req;
        const response = await axios.get(`http://users-microservice/api/auth`, 
            {params: {
                email: email,
                password: password,
        }});

        const user = response.data?.user;

        //Exists
        if(!user || user == null || user == "Failed to find"){
            console.log("Invalid credentials");
            return res.status(401).send({msg: "Bad credentials"});
        }
        else{
            console.log("valid credentials");
            //Updates session
            const recastUser = user;
            req.session.user = {...recastUser, password:password};
            const {startingPage: startingPage} = recastUser;
            return res.status(200).send({msg: "Valid crendentials", startingPage:startingPage});
        }
    }
    catch(err){
        console.log("Invalid credentials due to error:\n");
        console.log(err);
        return res.status(401).send({msg: "Bad credentials"});
    }
    
}

//Check if user is logged in
async function authStatus(req, res){
    try{
        console.log(req.session.user);
        const user = (await axios.get(`http://users-microservice/api/auth`, 
            {params: {
                email: req.session.user.email,
                password: req.session.user.password,
        }})).data?.user

        console.log(user);
        if(typeof req.session.user === "undefined"|| typeof user === "undefined" || user === "Failed to find" || user === null){
            return res.status(401).send({msg:"Not authenticated"})
        } 
        return res.status(200).send({msg:"You are authenticated"});
    }
    catch(err){
        console.log(err);
        return res.status(401).send({msg:"Not authenticated"})
    }
}

async function removeAuth(req, res) {
    try{
        req.session.destroy();
        return res.status(200).send({msg:"Logged out"});
    }
    catch{
        return res.status(500).send({msg:"Failed to log out"});
    }
    
}

module.exports = {
    authenicate,
    authStatus,
    removeAuth,
}