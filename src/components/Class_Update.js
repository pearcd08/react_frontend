import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";
import Course_Options from "./Course_Options";
import Semester_Options from "./Semester_Options";
import Lecturer_Options from "./Lecturer_Options";


function UpdateClass(props) {
    const location = useLocation();
    const class_id = location.state.c_id;
    const token = localStorage.getItem("token");
    const [selectedClass, setClass] = useState({});
    const [number, setNumber] = useState("");
    const [course, setCourse] = useState({});
    const [semester, setSemester] = useState({});
    const [lecturer, setLecturer] = useState({});
    const [hasToken, setHasToken] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        axios.get(BaseUrl + "class/" + class_id + "/", {
            headers: {
                "Authorization": "Token " + token
            }
        })
            .then(response => {
                setClass(response.data);
                setNumber(response.data.number);
                setCourse(response.data.course);
                setSemester(response.data.semester);
            }).catch(error => {
            console.log(error)
        })
    }, [])

    function updateClass() {


        let data = {
            number: number,
            course: course,
            class: selectedClass,
            semester: semester,
            lecturer: lecturer

        };

        if (number.length > 0) {
            axios.put(BaseUrl + "class/" + class_id + "/", data, {
                headers: {
                    "Authorization": "Token " + token
                }
            }).then(response => {
                alert("Updated successfully");
                navigate("/class_list");

            }).catch(error => {
                console.log(error)
            })
        } else {
            alert("Enter all values!")
        }


    }


    function numberHandler(event) {
        setNumber(event.target.value);
    }

    function courseHandler(event) {
        setCourse(event.target.value);
    }

    function semesterHandler(event) {
        setSemester(event.target.value);
    }

    function lecturerHandler(event) {
        setLecturer(event.target.value);
    }


    return (

            <div className={"center-form"}>
                <h2 className="title">Update Class</h2>
                <label>Number:</label>
                <br/>
                <input type={"text"} id={"number"} value={number} onChange={numberHandler}/>
                <br/>
                <label>Course:</label>
                <br/>
                <select className={"select"} id={"course"} value={course} onChange={courseHandler}>
                    <Course_Options/>
                </select>
                <br/>
                <label>Semester:</label>
                <br/>
                <select className={"select"} id={"semester"} value={semester} onChange={semesterHandler}>
                    <Semester_Options/>
                </select>
                <br/>
                <button className={"btn btn-success"} onClick={updateClass}>Update</button>
                <Link to={"/class_list"}>
                    <button className={"btn btn-warning"}>Back</button>
                </Link>


            </div>

    );
}

export default UpdateClass;