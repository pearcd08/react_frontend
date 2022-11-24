import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";
import FullName from "./Full_Name";
import Class_Options from "./Class_Options";
import Course_Name from "./Course_Name";
import Attendance_Percentage from "./Class_Attendance";
import Class_Attendance from "./Class_Attendance";

function StudentDetail(props) {
    const location = useLocation();
    const student_id = location.state.s_id
    const user_id = location.state.u_id
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [student, setStudent] = useState([]);
    const [user, setUser] = useState("");
    const [studentClasses, setStudentClasses] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [hasAdmin, setAdmin] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)


    useEffect(() => {
        if (localStorage.getItem("token")) {
            setHasToken(true);

            axios.get(BaseUrl + "student/" + student_id + "/", {
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                setStudent(response.data);


            }).catch(error => {
                console.log(error)
            })
        } else {
            setHasToken(false);
        }
    }, []);

    //get user details
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setHasToken(true);

            axios.get(BaseUrl + "user/" + user_id + "/", {
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                setUser(response.data);

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
        axios.get(BaseUrl + "student_class/" + student_id + "/", {
            headers: {"Authorization": "Token " + localStorage.getItem("token")}
        })
            .then(response => {
                setStudentClasses(response.data)
                console.log(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [refreshKey]);

    useEffect(() => {
        axios.get(BaseUrl + "available_student_class/" + student_id + "/", {
            headers: {"Authorization": "Token " + localStorage.getItem("token")}
        })
            .then(response => {
                setAvailableClasses(response.data)
                console.log(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [refreshKey]);


    function enrolStudent(event) {
        let login_token = localStorage.getItem("token");
        let class_id = event.target.value;

        axios.post(BaseUrl + "enrollment/" + class_id + "/" + student_id + "/","", {
            headers: {
                "Authorization": "Token " + login_token
            }
        }).then(response => {
            setRefreshKey(oldKey => oldKey + 1)


        }).catch(error => {
            console.log(error)

        })

    }

    function withdrawStudent(event) {

        let login_token = localStorage.getItem("token");
        let class_id = event.target.value;

        axios.delete(BaseUrl + "withdraw/" + class_id + "/" + student_id + "/", {
            headers: {
                "Authorization": "Token " + login_token
            }
        }).then(response => {
            setRefreshKey(oldKey => oldKey + 1)


        }).catch(error => {
            console.log(error)

        })

    }


    return (<div>


        <div className={"center-form"}>
            <h3 className={"title"}>Student Details</h3>
            <br/>
            <p className={"title"}> Name: <FullName userID={user_id}/></p>
            <p className={"title"}> Email: {user.email}</p>
            <p className={"title"}> Username: {user.username}</p>
            <p className={"title"}> D.O.B: {student.dob}</p>
            <br/>
            <br/>


            <h5><FullName userID={user_id}/>'s Classes</h5>
            <table className="table table-striped">
                <tbody>

                {studentClasses.map(sc => <tr scope="row" key={sc.class_id}>
                    <td scope="col" className={"name-col"}>{sc.number} - <Course_Name
                        courseID={sc.course}/> Attendance:
                        <Class_Attendance classID={sc.class_id} studentID={student.student_id}/>


                    </td>

                    <td scope="col">
                        {hasAdmin ? <button className={"btn btn-danger"} value={sc.class_id}
                                            onClick={withdrawStudent}>Withdraw
                        </button> : ""}

                    </td>

                </tr>)}
                </tbody>
            </table>

            {hasAdmin ? <div>
                    <h5> Available Classes</h5>
                    <table className="table table-striped">
                        <tbody>

                        {availableClasses.map(ac => <tr scope="row" key={ac.class_id}>
                            <td scope="col" className={"name-col"}>{ac.number} - <Course_Name courseID={ac.course}/>
                            </td>
                            <td scope="col">
                                <button className={"btn btn-success"} value={ac.class_id}
                                        onClick={enrolStudent}>Enrol
                                </button>
                            </td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>


                : ""}


            <Link to={"/student_list"}>
                <button className={"btn btn-warning"}>Back</button>
            </Link>

        </div>

    </div>);
}

export default StudentDetail;