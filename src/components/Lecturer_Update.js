import React, {useEffect, useState} from 'react';
import {BaseUrl} from "./constants";
import axios from "axios";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {confirmAlert} from "react-confirm-alert";

function Lecturer_Update(props) {
    const location = useLocation();
    const lecturer_id = location.state.s_id;
    const user_id = location.state.u_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [lecturer, setLecturer] = useState([]);
    const [user, setUser] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [DOB, setDOB] = useState("");
    const [hasAdmin, setAdmin] = useState(false)
     const navigate = useNavigate();


    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            setHasToken(true)
        }
    }, [])


    useEffect(() => {
        if (localStorage.getItem("token")) {
            setHasToken(true);

            axios.get(BaseUrl + "lecturer/" + lecturer_id + "/", {
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                setLecturer(response.data);
                setDOB(response.data.dob);
                console.log(DOB);


            }).catch(error => {
                console.log(error)
            })
        } else {
            setHasToken(false);
        }
    }, []);

       useEffect(() => {
        if (localStorage.getItem("token")) {
            setHasToken(true);

            axios.get(BaseUrl + "user/" + user_id + "/", {
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                setUser(response.data);
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
                console.log(response.data);

            }).catch(error => {
                console.log(error)
            })
        } else {
            setHasToken(false);
        }
    }, []);

     function updateLecturer() {

        let data = {
            firstname: firstName,
            lastname: lastName,
            dob: DOB,

        };

        if (firstName.length > 0 && lastName.length > 0 && DOB.length > 0) {
             axios.put(BaseUrl + "lecturer/" + lecturer_id + "/", data, {
                headers: {
                    "Authorization": "Token " + token
                }
            }).then(response => {
                alert("Updated successfully");
                navigate("/lecturer_list");

            }).catch(error => {
                console.log(error)
            })


        } else {
            alert("Enter all values!")
        }


    }



    function firstNameHandler(event) {
        setFirstName(event.target.value);
    }

    function lastNameHandler(event) {
        setLastName(event.target.value);
    }

    function dobHandler(event) {
        setDOB(event.target.value)
    }


    return (

        <div>

            <div className="center-form">


                <div className="input-form">
                    <h2 className="title">Update Lecturer</h2>

                    <label>First Name </label>
                    <br/>
                    <input type={"text"} id={"firstname"} value={firstName} onChange={firstNameHandler}/>
                    <br/>
                    <label>Last Name: </label>
                    <br/>
                    <input type={"text"} id={"lastname"} value={lastName} onChange={lastNameHandler}/>
                    <br/>
                    <label>Date of Birth: </label>
                    <br/>
                    <input type={"date"} id={"dob"} value={DOB} onChange={dobHandler}/>                    <br/>

                    <button className="btn btn-info" onClick={updateLecturer}>Update</button>

                </div>


            </div>


        </div>


    )
        ;

}

export default Lecturer_Update;