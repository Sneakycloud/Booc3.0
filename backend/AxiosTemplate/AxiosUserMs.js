const axios = require('axios');
const dotenv = require("dotenv").config();


const usersMsApi = () => {
  var AxiosApi;


  //--------------------------------------
  return axios.create({baseURL:`http://users-microservice`});




  //--------------------------------------
  if(process.env.PRODUCTION_ENV == true || process.env.PRODUCTION_ENV == "true"){
    console.log("BaseURL called with azure");
    AxiosApi = axios.create({baseURL:`http://users-microservice`});
  }
  else{
    console.log("BaseURL called with localhost");
    AxiosApi = axios.create({baseURL:"http://localhost:4000/"});
  }
  return AxiosApi;
  
}

module.exports = {usersMsApi};