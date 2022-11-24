import React, {useEffect, useState} from 'react';
import {BaseUrl} from "./constants";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import FullName from "./Full_Name";
import {confirmAlert} from "react-confirm-alert";


function Student_List(props) {
    const [students, setStudents] = useState([]);
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
    const [refreshKey, setRefreshKey] = useState(0);
    const [studentID, setStudentID] = useState(0);
    const [hasAdmin, setAdmin] = useState(false);


    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            setHasToken(true)
        }
    }, [])

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setHasToken(true);
            axios.get(BaseUrl + "student_id_search/", {
                headers:
                    {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                setStudentID(response.data.studentid);
                console.log(response.data.studentid);
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
            axios.get(BaseUrl + "is_super_user/", {
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                if (response.data.superuser === "true") {
                    setAdmin(true)
                    console.log("has admin")
                } else {
                    setAdmin(false)
                    console.log("no admin")
                }

            }).catch(error => {
                console.log(error)
            })
        } else {
            setHasToken(false);
        }
    }, []);


    useEffect(() => {
        axios.get(BaseUrl + "student/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setStudents(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [refreshKey]);


    function saveStudent() {
        let login_token = localStorage.getItem("token");

        let data = {
            firstname: firstName,
            lastname: lastName,
            username: userName,
            email: email,
            dob: dob,
            password: password

        };
        if (password.length < 6) {
            alert("Password must be more than 6 characters");


        }
        if (firstName.length > 0 && lastName.length > 0 && userName.length > 0 &&
            email.length > 0 && password.length > 6 && dob.length > 0) {
            axios.post(BaseUrl + "student_viewset/", data, {
                headers: {
                    "Authorization": "Token " + login_token
                }
            }).then(response => {
                alert("Create successfully")
                setRefreshKey(oldKey => oldKey + 1)


            }).catch(error => {
                console.log(error)

            })

        } else {
            alert("Enter all Fields")
        }


    }


    function deleteStudent(event) {
        let login_token = localStorage.getItem("token");
        let student_id = event.target.value;
        axios.delete(BaseUrl + "student/" + student_id + "/", {
            headers: {
                "Authorization": "Token " + login_token
            }
        })
            .then(response => {
                alert("Student has been deleted");
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
                        <h3>Delete this Student?</h3>
                        <div className={"button-container"}>
                            <button className={"btn btn-primary"} onClick={onClose}>No</button>
                            <button className={"btn btn-danger"}
                                    onClick={() => {
                                        deleteStudent(event);
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

        <div>
            <div>

                {hasAdmin ?
                    <div className={"input-form"}>
                        <h2 className="title">Create Student</h2>

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


                        <button className="btn btn-info" onClick={saveStudent}>Save Student</button>
                        <Link to ={"/student_upload"}>
                                                    <button className="btn btn-warning">Upload Excel</button>
                        </Link>


                    </div>
                    : ""}


                <div className="list-box">

                    <h2 className="title">Students</h2>

                    <table className={"table table-striped"}>

                        <tbody>

                        {students.map(student =>

                            <tr scope="row" key={student.student_id}>

                                <td scope="col" className={"name-col"}><FullName userID={student.user}/></td>
                                <td scope="col">
                                    {hasAdmin ?
                                        <Link to={"/student_update"}
                                              state={{s_id: student.student_id, u_id: student.user}}
                                              className={"btn btn-warning"}>Update</Link>
                                        : ""}
                                    {hasAdmin ?
                                        <button value={student.student_id} onClick={confirmDelete}
                                                className={"btn btn-danger"}>Delete
                                        </button>
                                        : ""}

                                    {studentID == student.student_id || hasAdmin ?
                                        <Link to={"/student_detail"}
                                              state={{s_id: student.student_id, u_id: student.user}}
                                              className={"btn btn-info"}>Details</Link> : ""}</td>


                            </tr>
                        )}

                        </tbody>
                    </table>


                </div>

            </div>

        </div>


    );

}

export default Student_List;