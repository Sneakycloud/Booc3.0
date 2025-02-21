import * as React from 'react';
import {redirect, useNavigate} from "react-router-dom";
import {isAuth} from "../modelData/auth";
import {getCurrentUser} from "../modelData/user"

export async function AuthLoader(){
    //console.log("Starting auth");
    const response = await isAuth();
    //console.log(response);
    if( response !== "authenticated"){
        return redirect("/");
    }
    //Get user
    console.log("tried?");
    const user = await getCurrentUser();
    if(user === "Failed to get user"){
        return null;
    }
    return user;
}