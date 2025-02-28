//Startup
//just checks that express is working
async function started(req,res) {
    console.log("User microservice start probe successful")
    res.status(200).send("User microservice has started");
}


//Readiness
//Checks that all microservices are ready
async function ready(req,res) {
    console.log("User microservice probe successful")
    res.status(200).send("User microservice is ready");
}

//Liveness
//just checks that it can respond to requests
async function alive(req,res) {
    console.log("User microservice alive probe successful")
    res.status(200).send("User microservice is alive");
}

module.exports = {
    started,
    ready,
    alive,
}