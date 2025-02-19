import axios from 'axios';
axios.defaults.withCredentials = true;

export const api = axios.create({
    baseURL: "http://132.164.68.41:443/",
    withCredentials: true,
    headers:{
      "Access-Control-Allow-Credentials":"true",
    }
  })