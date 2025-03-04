const axios = require('axios');


const usersMsApi = () => {
  var AxiosApi;
  if(process.env?.PROD == true || process.env?.PROD == "true"){
    AxiosApi = axios.create({baseURL:`http://users-microservice`});
  }
  else{
    AxiosApi = axios.create({baseURL:"http://localhost:4000/"});
  }
  return AxiosApi;
  
}

module.exports = {usersMsApi};