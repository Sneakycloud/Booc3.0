const axios = require('axios');

//Startup
//just checks that express is working
async function started(req,res) {
    console.log("Backend start probe successful")
    res.status(200).send("Backend has started");
}


//Readiness
//Checks that all microservices are ready
async function ready(req,res) {
    //Users microservice
    console.log("Production:", process.env.PROD);
    
    const usersStatus = (await axios.get(`http://users-microservice/health/ready`)).status;

    //

    //final check, to see if all services which backend needs are ready
    //When adding more microservices then add more to this if statement
    if(usersStatus == 200){
        console.log("Backend probe for readiness was successful")
        res.status(200).send("Backend is ready");
    }
    else{
        console.log("Backend check for readiness failed");
        res.status(500).send("Backend is not ready");
    }
}

//Liveness
//just checks that it can respond to requests
async function alive(req,res) {
    console.log("Backend alive probe successful")
    res.status(200).send("Backend is alive");
}

module.exports = {
    started,
    ready,
    alive,
}