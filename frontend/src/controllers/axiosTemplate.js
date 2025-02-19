import axios from 'axios';
axios.defaults.withCredentials = true;

export const api = axios.create({
    baseURL: "https://132.164.31.120:443/",
    withCredentials: true,
    headers:{
      "Access-Control-Allow-Credentials":"true",
    }
  })