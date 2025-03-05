import axios from 'axios';

export const api = () => {
  console.log("PROD is", process.env?.REACT_APP_PROD);
  
  //-------------------------------------------------------
  return axios.create({
    baseURL: "http://74.178.165.24:80",
    //withCredentials: true,
    headers:{
      //"Access-Control-Allow-Credentials":"true",
      "Authorization": authheader()
    }
  })



  //-------------------------------------------------------
  if(process.env.REACT_APP_PROD == true || process.env.REACT_APP_PROD == "true"){
    return axios.create({
      baseURL: "http://74.178.165.24",
      //withCredentials: true,
      headers:{
        //"Access-Control-Allow-Credentials":"true",
        "Authorization": authheader()
      }
    })
  }
  else{
    return axios.create({
      baseURL: "http://localhost:6400",
      //withCredentials: true,
      headers:{
        //"Access-Control-Allow-Credentials":"true",
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