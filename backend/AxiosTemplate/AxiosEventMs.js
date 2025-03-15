const axios = require('axios');
const dotenv = require("dotenv").config();


const eventsMsApi = () => {
  var AxiosApi;

  if(process.env.PRODUCTION_ENV == true || process.env.PRODUCTION_ENV == "true"){
    console.log("BaseURL called with azure");
    AxiosApi = axios.create({baseURL:`http://event-microservice`});
  }
  else{
    console.log("BaseURL called with localhost");
    AxiosApi = axios.create({baseURL:"http://localhost:5000/"});
  }
  return AxiosApi;
}

module.exports = {eventsMsApi};