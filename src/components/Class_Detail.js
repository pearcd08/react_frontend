import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";
import Lecturer_Name from "./Lecturer_Name";
import FullName from "./Full_Name";
import Class_Attendance from "./Class_Attendance";
import {Button, ListGroup} from "react-bootstrap";
import Course_Name from "./Course_Name";
import Student_Email from "./Student_Email";
import Semester_Name from "./Semester_Name";
import {confirmAlert} from "react-confirm-alert";

function ClassDetail(props) {
    const location = useLocation();
    const [lecturerID, setLecturerID] = useState(0);
    const class_id = location.state.c_id;
    const [selectedClass, setClass] = useState([]);
    const [course, setCourse] = useState("");
    const [semester, setSemester] = useState("");
    const [lecturer, setLecturer] = useState("");
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [collegeDays, setCollegeDays] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [hasAdmin, setAdmin] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setHasToken(true);
            axios.get(BaseUrl + "user_id_search/", {
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

            axios.get(BaseUrl + "class/" + class_id + "/", {
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                setClass(response.data);
                setCourse(<Course_Name courseID={response.data.course}/>);
                setSemester(<Semester_Name semesterID={response.data.semester}/>);
                setLecturer(<Lecturer_Name lecturerID={response.data.lecturer}/>);
                console.log(response.data);
                console.log(class_id)


            }).catch(error => {
                console.log(error);
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
        axios.get(BaseUrl + "class_student_list/" + class_id + "/", {
            headers: {"Authorization": "Token " + localStorage.getItem("token")}
        })
            .then(response => {
                setEnrolledStudents(response.data);
            }).catch(error => {
            console.log(error)
        })
    }, []);


    useEffect(() => {
        axios.get(BaseUrl + "collegeday/", {
            headers: {"Authorization": "Token " + localStorage.getItem("token")}
        })
            .then(response => {
                setCollegeDays(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [refreshKey]);


    function saveCollegeDay() {
        console.log(document.getElementById("date").value)
        let login_token = localStorage.getItem("token");

        let data = {

            college_date: document.getElementById("date").value, college_class: class_id


        };

        axios.post(BaseUrl + "collegeday_viewset/", data, {
            headers: {
                "Authorization": "Token " + login_token
            }
        }).then(response => {
            setRefreshKey(oldKey => oldKey + 1);


        }).catch(error => {
            console.log(error)

        })
    }

    function deleteCollegeDay(event) {
        let login_token = localStorage.getItem("token");
        let collegeday_id = event.target.value;
        axios.delete(BaseUrl + "collegeday/" + collegeday_id + "/", {
            headers: {
                "Authorization": "Token " + login_token
            }
        })
            .then(response => {
                setRefreshKey(oldKey => oldKey + 1);

            }).catch(error => {
            console.log(error)
        })
    }
        const confirmDelete = (event) => {

        confirmAlert({
            customUI: ({onClose}) => {
                return (<div className={'popup-delete'}>
                    <h3>Delete this CollegeDay?</h3>
                    <div className={"button-container"}>
                        <button className={"btn btn-primary"} onClick={onClose}>No</button>
                        <button className={"btn btn-danger"}
                                onClick={() => {
                                    deleteCollegeDay(event);
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




    return (<div>
        <div className={"detail-box"}>
            <h3 className={"title"}>Class Details</h3>
            <br/>
            <p className={"title"}>Number: {selectedClass.number} </p>
            <p className={"title"}>Course: {course} </p>
            <p className={"title"}>Semester: {semester}</p>
            <p className={"title"}>Lecturer: {lecturer}</p>            <br/>
            <h5>Enrolled Students</h5>

            <table className="table table-striped">
                <tbody>
                {enrolledStudents.map(student => <tr scope="row" key={student.student_id}>
                    <td scope="col" className={"name-col-student"}><FullName userID={student.user}/></td>
                    <td scope="col">
                        <Class_Attendance classID={class_id} studentID={student.student_id}/>
                    </td>
                    <td scope="col">
                        <Link to={"/student_email"} state={{u_ID: student.user, c_ID: class_id}}>

                            <Button>
                                Email
                            </Button>
                        </Link>

                    </td>


                </tr>)}
                </tbody>
            </table>

        </div>


        <div className={"input-form2"}>
            {hasAdmin ?
                <div>
                    <h3 className={"title"}> Add College Day</h3>
                    <input type={"date"} id={"date"}/>
                    <br/>
                    <br/>
                    <button className={"btn btn-success"} onClick={saveCollegeDay} type="button">Add College Day
                    </button>
                </div>
                : ""}

            <div>
                <br/>
                    <br/>
                         <h5>College Days</h5>
                <table className="table table-striped">
                    <tbody>
                    {collegeDays.map(collegeDay => <tr scope="row" key={collegeDay.collegeday_id}>
                        <td scope="col" className={"name-col-date"}>{collegeDay.college_date}</td>
                        <td scope="col">
                            {}
                            {lecturerID == selectedClass.lecturer ?
                                <Link to={"/collegeday_detail"}
                                      state={{cd_id: collegeDay.collegeday_id, c_id: class_id}}>
                                    <Button className={"btn btn-update"}>
                                        Details
                                    </Button>
                                </Link>
                                : ""}
                            {hasAdmin ?
                                <Button className={"btn btn-danger"} value={collegeDay.collegeday_id}
                                        onClick={confirmDelete}>
                                    Delete
                                </Button> : ""}
                        </td>

                    </tr>)}
                    </tbody>
                </table>
            </div>
        </div>


    </div>);
}

export default ClassDetail;