const usersModel = require('../Model/usersModel.js');
const axios = require('axios');
//const jwt = require('jsonwebtoken');
const jwt = require('jwt-express');

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
            const {startingPage: startingPage} = recastUser;
            const token = (jwt.create(process.env.SESSION_SECRET, {...recastUser, password:password})).token;
            //token = jwt.sign({...recastUser, password:password}, process.env.SESSION_SECRET, {expiresIn: '4h',});
            return res.status(200).send({msg: "Valid crendentials", startingPage:startingPage, token});
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
        console.log("Jwt:",req.jwt.payload)
        console.log("headers: ", req.headers)
        const user = (await axios.get(`http://users-microservice/api/auth`, 
            {params: {
                email: req.jwt.payload.email,
                password: req.jwt.payload.password,
        }})).data.user

        //console.log(user);
        if(typeof req.jwt.payload === "undefined"|| typeof user === "undefined" || user === "Failed to find" || user === null){
            return res.status(401).send({msg:"Not authenticated"})
        } 
        return res.status(200).send({msg:"You are authenticated"});
    }
    catch(err){
        console.log("Not authenticated error: ", err);
        return res.status(401).send({msg:"Not authenticated"})
    }
}

async function removeAuth(req, res) {
    try{
        //token = jwt.sign(null, process.env.SESSION_SECRET, {expiresIn: '4h',});
        const token = (jwt.create(process.env.SESSION_SECRET, null)).token;
        return res.status(200).send({msg:"Logged out", token});
    }
    catch(err){
        return res.status(500).send({msg:"Failed to log out"});
    }
    
}

module.exports = {
    authenicate,
    authStatus,
    removeAuth,
}