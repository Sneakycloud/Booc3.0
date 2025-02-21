import axios from 'axios';
axios.defaults.withCredentials = true;

export const api = axios.create({
    baseURL: "http://132.164.68.41:80/",
    withCredentials: true,
    headers:{
      "Access-Control-Allow-Credentials":"true",
      "Authorization": authheader()
    }
  })

function authheader(){
  token = localStorage.getItem('token');
  header = `bearer ${token}`;
  if(!token){return null}
  return header;
}