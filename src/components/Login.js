import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import {useNavigate} from "react-router-dom";


function Login(props) {

    const [token, setToken] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem(token));
            setHasToken(true);
        }
    }, [token]);


    function usernameHandler(event) {
        setUsername(event.target.value)
    }

    function passwordHandler(event) {
        setPassword(event.target.value)
    }

    function login() {
        axios.post(BaseUrl + "auth/", {
            username: username, password: password,
        }).then(response => {
            console.log(response.data);
            setToken(response.data);
            setHasToken(true);
            localStorage.setItem("token", response.data.token);
            navigate("/");
            window.location.reload();
        }).catch(error => {
            console.log(error)
            alert("Enter valid username and password")
        })

    }

    function logout() {
        let userToken = localStorage.getItem("token");
        axios.get(BaseUrl + "auth/logout/", {
            headers: {
                'Authorization': 'Token ' + userToken,

            }

        }).then(response => {
            console.log(response);
            localStorage.removeItem("token");
            setToken("");
            setHasToken(false);
            window.location.reload();
        }).catch(error => {
            console.log(error)
        })


    }


    return (
        <div>
            {!hasToken ?
                <div>

                    <div className={"center-form"}>
                        <br/>
                        <h3 className={"title"}>Login</h3>
                        <label>Username: </label>
                        <br/>
                        <input  name={"username"}
                               onChange={usernameHandler}/>
                        <br/>
                        <label>Password: </label>
                        <br/>
                        <input  name={"password"}
                               onChange={passwordHandler}/>
                        <br/>
                        <button className={"btn btn-success"} onClick={login}>Login</button>

                    </div>
                </div> :
                <div>
                    <div>

                        <button onClick={logout}>Logout</button>
                        }

                    </div>
                </div>}
        </div>
    );
}

export default Login;