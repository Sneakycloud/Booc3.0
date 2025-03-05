import axios from 'axios';
axios.defaults.withCredentials = true;

export const api = axios.create({
    baseURL: "http://74.178.165.24", //backend.default.svc.cluter.local
    withCredentials: true,
    headers:{
      "Access-Control-Allow-Credentials":"true",
      "Authorization": authheader()
    }
  })

function authheader(){
  const token = localStorage.getItem('token');
  const header = `bearer ${token}`;
  if(!token){return null}
  return header;
}