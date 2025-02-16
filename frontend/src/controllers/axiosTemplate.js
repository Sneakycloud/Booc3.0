import axios from 'axios';
axios.defaults.withCredentials = true;

export const api = axios.create({
    baseURL: "http://http://9.163.80.93:80/",
    withCredentials: true,
    headers:{
      "Access-Control-Allow-Origin": "http://9.163.80.93:80/",
      "Access-Control-Allow-Credentials":"true",
    }
  })