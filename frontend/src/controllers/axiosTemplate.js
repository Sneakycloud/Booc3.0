import axios from 'axios';

export const api = () => {
  if(process.env?.Prod == true || process.env?.Prod == "true"){
    return axios.create({
      baseURL: "http://backend",
      //withCredentials: true,
      headers:{
        "Access-Control-Allow-Credentials":"true",
        "Authorization": authheader()
      }
    })
  }
  else{
    return axios.create({
      baseURL: "http://localhost:6400",
      //withCredentials: true,
      headers:{
        "Access-Control-Allow-Credentials":"true",
        "Authorization": authheader()
      }
    })
  }


}






function authheader(){
  const token = localStorage.getItem('token');
  const header = `bearer ${token}`;
  if(!token){return null}
  return header;
}