const axios = require('axios');
const dotenv = require("dotenv").config();


const groupsMsApi = () => {
  var AxiosApi;
  //console.log("Env vars:", process.env);
  //console.log("Production:", process.env.PRODUCTION_ENV);

  //--------------------------------------
  //return axios.create({baseURL:`http://users-microservice`});




  //--------------------------------------
  if(process.env.PRODUCTION_ENV == true || process.env.PRODUCTION_ENV == "true"){
    console.log("BaseURL called with azure");
    AxiosApi = axios.create({baseURL:`http://group-microservice`});
  }
  else{
    console.log("BaseURL called with localhost");
    AxiosApi = axios.create({baseURL:"http://localhost:8080/"});
  }
  return AxiosApi;
  
}

module.exports = {groupsMsApi};