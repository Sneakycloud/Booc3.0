const axios = require('axios');


const usersMsApi = () => {
  var AxiosApi;
  if(process.env?.Prod == true || process.env?.Prod == "true"){
    AxiosApi = axios.create({baseURL:`http://users-microservice`});
  }
  else{
    AxiosApi = axios.create({baseURL:"http://localhost:4000/"});
  }
  return AxiosApi;
  
}

module.exports = {usersMsApi};