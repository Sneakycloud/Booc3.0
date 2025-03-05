const axios = require('axios');


const usersMsApi = () => {
  var AxiosApi;
  if(process.env?.PROD == true || process.env?.PROD == "true"){
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