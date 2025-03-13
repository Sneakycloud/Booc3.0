const usersModel = require('../Model/usersModel.js');


//
//Get user info
async function getCurrentUser(req, res){
    try{
        //Parse
        const {username, identifier} = req.query;

        //Updates user session before returning it
        const databaseUser = await usersModel.getUserWithUsername(username, identifier);
        return res.status(200).send({user: databaseUser})
        
    }
    catch(err){
        console.log("Failed in function getCurrentUser\n",err);
        return res.status(500).send({msg:"Failed to get current user"});
    }
}

//Used by /Auth to check user credentials
async function getUser(req, res){
    try{
        //Extract parameters from req
        const {email, password} = req.query;
        //Check auth
        const user = await usersModel.getUser(email, password);
        return res.status(200).send({user:user});
    }
    catch{
        return res.status(500).send({msg:"Failed to getUser"})
    }
    
}

//Create user
async function createUser(req, res){
    try{
        const {email, username, password} = req.body;
        const result = await usersModel.createUser(email, username, password);

        return res.status(200).send({user:result});
    }
    catch{
        console.log("Failed to create User")
        return res.status(500).send({msg:"Failed to create user"});
    }
    
}


async function changeStartPage(req, res) {
    const {email, password, startPage} = req.body;
    const result = await usersModel.changeStartPage(email, password, startPage);
    return res.status(200).send({result:result});
}


async function changePassword(req, res) {
    const {email, password, newPassword} = req.body;
    const result = await usersModel.changePassword(email, password, newPassword);
    return res.status(200).send({result:result});
}


async function deleteUser(req, res) {
    const {email, password} = req.body;
    //console.log("Email: ", email);
    //console.log("Password. ", password);
    //console.log(req);
    const result = await usersModel.deleteUser(email, password);
    return res.status(200).send({result:result});
}





module.exports = {
    getCurrentUser, 
    getUser,   
    createUser,
    deleteUser,
    changeStartPage,
    changePassword,
}