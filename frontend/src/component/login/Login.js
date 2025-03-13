import * as React from 'react';
import Textfield, {TextFieldPassword} from '../TextField.js';
import {Link, redirect, useNavigate, useSubmit} from "react-router-dom";
import { colors } from '@mui/material';
import {Formik, Form} from "formik";
import {login as loginModel} from '../../modelData/auth.js'
//import {isAuth} from "../../modelData/auth.js"


export function authenticatedLoader(){
    //Gets current users email and password and authenticates it
    //Gets email and password (first checks if they exist)
    alert("Failed to sign up")
    //await authentication from api
    //const response = Auth(email, password);

    //redirect back to home page if not logged in
    //if(response === "Not authenticated"){return redirect("/");}
}


export async function loginAction({request}){
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    const response  = await loginModel(email, password);
    if(response === "invalid"){
        //Set MUI prop for error to true
        alert("Failed to login")
        return null;
    }
    else{
        return redirect(response);
    }
}

export default function Login_page(){
    //let [failedLogin, setFailedLogin] = React.useState(false);
    let navigate = useNavigate();

    const changeToSignUpPage = () => {
        let path = "/SignUp";
        navigate(path);
    }

    const changeToProfile = () => {
        let path = "/Profile";
        navigate(path);
    }

    const submit = useSubmit();

    return(
        <div className='Page'>
            <div className='Intro_Logo'>
                <div>
                    <h1>Booc</h1>
                    <p>A new chapter</p>  
                </div>
                <img 
                    src="/assets/free_book_image.png" 
                    alt='WeDoNotNeedSleep' 
                    style={{ position: 'absolute', width: '150px', height: 'auto', top: '0px', right: '0px' }}
                />
            </div>

            <Formik initialValues={{email:"", password:""}} onSubmit={(values) => {submit(values, {method:"post"})} } //onSubmit={login}
                >{({values, handleChange}) => (
                    <Form method='post' className='form'>
                        <div className='LoginFields'>
                            <Textfield 
                                name="email" 
                                type="email"
                                value={values.email} 
                                onChange={handleChange} 
                                label="email" 
                                id="email" 
                                //error={failedLogin}
                                variant="outlined" />

                            <Textfield
                                name = "password"
                                type = "password"
                                value = {values.password}
                                onChange={handleChange}
                                label="Password"
                                id = "password"
                                //error={failedLogin}
                                autoComplete="current-password"/>
                            {/*
                            <Link to=''>Reset password </Link>*/}


                            <button className='rightButton' type="submit">Login</button>
                        </div>
                        <div className='PageButtonsLogin'>
                            <button className='leftButton' type='button' onClick={changeToSignUpPage}>← Sign up</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>     
    )
}