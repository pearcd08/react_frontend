import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";
import Lecturer_Name from "./Lecturer_Name";
import FullName from "./Full_Name";

function ClassDetail(props) {
    const location = useLocation();
    const collegeday_id = location.state.cd_id;
    const class_id = location.state.c_id;
    const [lecturerID, setLecturerID] = useState(0);
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [Class, setClass] = useState([]);
    const [collegeDay, setCollegeDay] = useState([""]);
    const [classID, setClassID] = useState("");
    const [students, setStudents] = useState([]);
    const [presentStudents, setPresentStudents] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setHasToken(true);

            axios.get(BaseUrl + "collegeday/" + collegeday_id + "/", {
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                setCollegeDay(response.data);
                setClassID(response.data.college_class)

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
        axios.get(BaseUrl + "absent_student_list/" + collegeday_id + "/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setStudents(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [refreshKey]);

    useEffect(() => {
        axios.get(BaseUrl + "present_student_list/" + collegeday_id + "/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setPresentStudents(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [refreshKey]);


    function markPresent(event) {
        let login_token = localStorage.getItem("token");
        let student_id = event.target.value;

        axios.post(BaseUrl + "present/" + collegeday_id + "/" + student_id + "/", "",{
            headers: {
                "Authorization": "Token " + login_token
            }
        }).then(response => {

                 setRefreshKey(oldKey => oldKey + 1);


        }).catch(error => {
            console.log(error)

        })

    }

    function markAbsent(event) {
        let login_token = localStorage.getItem("token");
        let student_id = event.target.value;

        axios.delete(BaseUrl + "absent/" + collegeday_id + "/" + student_id + "/", {
            headers: {
                "Authorization": "Token " + login_token
            }
        }).then(response => {
                setRefreshKey(oldKey => oldKey + 1);


        }).catch(error => {
            console.log(error)

        })

    }


    return (<div>
            <div className={"list-box"}>
                <h3 className={"title"}>College Day: {collegeDay.college_date}</h3>
                <h4> Absent Students</h4>
                <table className="table table-striped">
                    <tbody>
                    {students.map(absentstudent => <tr scope="row" key={absentstudent.student_id}>
                        <td scope="col" className={"name-col-two"}><FullName userID={absentstudent.user}/></td>
                        <td scope="col">
                            <button className={"btn btn-success"} value={absentstudent.student_id}
                                    onClick={markPresent}>Mark Present
                            </button>
                        </td>
                    </tr>)}
                    </tbody>
                </table>
                <h4> Present Students</h4>
                <table className="table table-striped">
                    <tbody>
                    {presentStudents.map(presentStudent => <tr scope="row" key={presentStudent.student_id}>
                        <td scope="col" className={"name-col-two"}><FullName userID={presentStudent.user}/></td>
                        <td scope="col">

                            <button className={"btn btn-danger"} value={presentStudent.student_id}
                                    onClick={markAbsent}>Mark Absent
                            </button>
                        </td>
                    </tr>)}
                    </tbody>
                </table>
                <Link to={"/class_detail"} state={{c_id: class_id}}>
                    <button className={"btn btn-warning"}>Back</button>
                </Link>
            </div>

        </div>


    );
}

export default ClassDetail;