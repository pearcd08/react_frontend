import React, {useEffect, useState} from 'react';
import {BaseUrl} from "./constants";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import FullName from "./Full_Name";
import {confirmAlert} from "react-confirm-alert";


function Lecturer_List(props) {
    const [lecturers, setLecturers] = useState([]);
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");


    const [refreshKey, setRefreshKey] = useState(0)




    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            setHasToken(true)
        }
    }, [])


    useEffect(() => {
        axios.get(BaseUrl + "lecturer/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setLecturers(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [refreshKey]);

    function saveLecturer() {
        let login_token = localStorage.getItem("token");

        let data = {
            firstname: firstName,
            lastname: lastName,
            username: userName,
            email: email,
            dob: dob,
            password: password

        };
        if(password.length < 6){
            alert("Password must be more than 6 characters");


        }
        if(firstName.length > 0 && lastName.length > 0 && userName.length > 0 &&
            email.length > 0 && password.length > 6 &&dob.length > 0){
              axios.post(BaseUrl + "lecturer_viewset/", data, {
            headers: {
                "Authorization": "Token " + login_token
            }
        }).then(response => {
            alert("Create successfully")
            setRefreshKey(oldKey => oldKey + 1)


        }).catch(error => {
            console.log(error)

        })

        }
        else{
            alert("Enter all Fields")
        }



    }

    function deleteLecturer(event) {
        let login_token = localStorage.getItem("token");
        let lecturer_id = event.target.value;
        axios.delete(BaseUrl + "lecturer/" + lecturer_id + "/", {
            headers: {
                "Authorization": "Token " + login_token
            }
        })
            .then(response => {
                alert("Lecturer has been deleted");
                setRefreshKey(oldKey => oldKey + 1)
            }).catch(error => {
            console.log(error)
        })
    }

      const confirmDelete = (event) => {

        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className={'popup-delete'}>
                        <h3>Delete this Lecturer?</h3>
                        <div className={"button-container"}>
                        <button className={"btn btn-primary"} onClick={onClose}>No</button>
                        <button className ={"btn btn-danger"}
                            onClick={() => {
                                deleteLecturer(event);
                                onClose();
                            }}
                        >
                            Yes
                        </button>
                    </div>
                    </div>
                );
            }
        });
    }

    function firstnameHandler(event) {
        setFirstName(event.target.value);
    }

    function lastnameHandler(event) {
        setLastName(event.target.value);
    }

    function usernameHandler(event) {
        setUserName(event.target.value)
    }

      function emailHandler(event) {
        setEmail(event.target.value)
    }

       function passwordHandler(event) {
        setPassword(event.target.value)
    }

    function dobHandler(event) {
        setDob(event.target.value)
    }





    return (

        <div className="container">

            <div className="input-form">
                <h2 className="title">Create Lecturer</h2>

                <label>First Name </label>
                <br/>
                <input type={"text"} id={"firstname"} onChange={firstnameHandler}/>
                <br/>
                <label>Last Name: </label>
                <br/>
                <input type={"text"} id={"lastname"} onChange={lastnameHandler}/>
                <br/>
                <label>Username: </label>
                <br/>
                <input type={"text"} id={"username"} onChange={usernameHandler}/>
                <br/>
                <label>Email Address: </label>
                <br/>
                <input type={"email"} id={"email"} onChange={emailHandler}/>
                <br/>
                <label>Password: </label>
                <br/>
                <input type={"password"} id={"password"} onChange={passwordHandler}/>
                <br/>
                <label>Date of Birth: </label>
                <br/>
                <input type={"date"} id={"dob"} onChange={dobHandler}/>
                <br/>

                <button className="btn btn-info" onClick={saveLecturer}>Save Lecturer</button>

            </div>


            <div className="list-box">
                <h2 className="title">Lecturers</h2>

                <table class="table table-striped">

                    <tbody>


                    {lecturers.map(lecturer =>

                        <tr scope="row" key={lecturer.lecturer_id}>

                            <td scope="col" className={"name-col"}><FullName userID={lecturer.user}/></td>
                            <td scope="col">
                                <Link to={"/lecturer_update"} state={{s_id: lecturer.lecturer_id, u_id: lecturer.user}}
                                      className={"btn btn-warning"}>Update</Link>


                                <button value={lecturer.lecturer_id} onClick={confirmDelete}
                                        className={"btn btn-danger"}>Delete
                                </button>


                                <Link to={"/lecturer_detail"} state={{l_id: lecturer.lecturer_id, u_id: lecturer.user}}
                                      className={"btn btn-info"}>Details</Link></td>


                        </tr>
                    )}

                    </tbody>
                </table>


            </div>
        </div>


    );

}

export default Lecturer_List;