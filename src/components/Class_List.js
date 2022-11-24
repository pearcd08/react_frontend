import React, {useEffect, useState} from 'react';
import {BaseUrl} from "./constants";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import Course_Options from "./Course_Options";
import Semester_Options from "./Semester_Options";
import Course_Name from "./Course_Name";
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function Class_List(props) {
    const [lecturerID, setLecturerID] = useState(0);
    const [classes, setClasses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [hasAdmin, setAdmin] = useState(false)
    const navigate = useNavigate();
    const [number, setNumber] = useState("");
    const [name, setName] = useState("2022");
    const [refreshKey, setRefreshKey] = useState(0);

        useEffect(() => {
        axios.get(BaseUrl + "class/", {
                headers:
                    {"Authorization": "Token " + localStorage.getItem("token")}}

        )
            .then(response => {
                setClasses(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [refreshKey]);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setHasToken(true);
            setToken(localStorage.getItem("token"));
            axios.get(BaseUrl + "lecturer_id_search/", {
                headers:
                    {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                setLecturerID(response.data.lecturerid)
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





    function saveClass() {

        let data = {
            number: number,
            course: document.getElementById("course").value,
            semester: document.getElementById("semester").value,

        };
        if (number.length > 0) {
            axios.post(BaseUrl + "class_viewset/", data, {
                headers: {
                    "Authorization": "Token " + token
                }
            }).then(response => {
                alert("Class Create successfully")
                setRefreshKey(oldKey => oldKey + 1)


            }).catch(error => {
                console.log(error)

            })

        } else {
            alert("Enter a number")
        }
    }

    const confirmDelete = (event) => {

        confirmAlert({
            customUI: ({onClose}) => {
                return (<div className={'popup-delete'}>
                    <h3>Delete this Class?</h3>
                    <div className={"button-container"}>
                        <button className={"btn btn-primary"} onClick={onClose}>No</button>
                        <button className={"btn btn-danger"}
                                onClick={() => {
                                    deleteClass(event);
                                    onClose();
                                }}
                        >
                            Yes
                        </button>
                    </div>
                </div>);
            }
        });
    }


    function deleteClass(event) {
        let login_token = localStorage.getItem("token");
        let Class_id = event.target.value;


        axios.delete(BaseUrl + "class/" + Class_id + "/", {
            headers: {
                "Authorization": "Token " + login_token
            }
        })
            .then(response => {
                alert("Class has been deleted");
                setRefreshKey(oldKey => oldKey + 1)
            }).catch(error => {
            console.log(error)
        })
    }

    function numberHandler(event) {
        setNumber(event.target.value);
    }


    return (<div>
        {hasAdmin ?
            <div className="input-form">
                <h2 className="title">Create Class</h2>
                <label>Number:</label>
                <br/>
                <input type={"text"} id={"number"} onChange={numberHandler}/>
                <br/>
                <label>Course:</label>
                <br/>
                <select className={"select"} id={"course"}>
                    <Course_Options/>
                </select>
                <br/>
                <label>Semester:</label>
                <br/>
                <select className={"select"} id={"semester"}>
                    <Semester_Options/>
                </select>
                <br/>
                <button className={"btn btn-success"} onClick={saveClass}>Save</button>
            </div>
            : ""}

        <div className="list-box">
            <h2 className={"title"}>Class List</h2>
            <table className="table table-striped">
                <tbody>
                {classes.map(Class => <tr scope="row" key={Class.class_id}>
                    <td scope="col" className={"name-col"}>{Class.number} - <Course_Name
                        courseID={Class.course}/></td>
                    <td scope="col">
                        {hasAdmin ?
                            <Link to={"/class_update"} state={{c_id: Class.class_id}}
                                  className={"btn btn-warning"}>Update</Link>
                            : ""}
                        {hasAdmin ?
                            <button value={Class.class_id} onClick={confirmDelete}
                                    className={"btn btn-danger"}>Delete
                            </button> : ""}

                        {lecturerID == Class.lecturer || hasAdmin ?
                            <Link to={"/class_detail"} state={{c_id: Class.class_id}}>
                                <button className={"btn btn-secondary"}>Details</button>
                            </Link> : ""}

                    </td>
                </tr>)}
                </tbody>
            </table>
        </div>
    </div>);
}

export default Class_List;