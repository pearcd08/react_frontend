import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";
import Lecturer_Name from "./Lecturer_Name";
import FullName from "./Full_Name";
import Course_Options from "./Course_Options";
import Semester_Options from "./Semester_Options";
import Lecturer_Options from "./Lecturer_Options";
import Class_Options from "./Class_Options";
import Course_Name from "./Course_Name";
import Attendance_Percentage from "./Class_Attendance";

function StudentEmail(props) {
    const location = useLocation();
    const user_id = location.state.u_ID;
    const class_id = location.state.c_ID;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [user, setUser] = useState("");
    const [classes, setClasses] = useState([]);
    const [hasAdmin, setAdmin] = useState(false)





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
                if (response.data.superuser == "true") {
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

    function emailStudent() {
        let login_token = localStorage.getItem("token");

        let data = {
            email: user.email,
            subject: document.getElementById("subject").value,
            body: document.getElementById("body").value,
        };

        axios.post(BaseUrl + "email_student/", data, {
            headers: {
                "Authorization": "Token " + login_token
            }
        }).then(response => {
            alert(response.data)


        }).catch(error => {
            console.log(error)

        })

    }




    return (

        <div className={"email-form"}>
            <label>Student:</label>
            <br/>
            <input type="text"  value={user.first_name +" "+ user.last_name} readOnly={"readonly"}/>
            <br/>
            <label>Email: </label>
            <br/>
            <input type="text" value={user.email} readOnly={"readonly"}/>
            <br/>
            <label>Subject: </label>
            <br/>
            <input type="text" id={"subject"}/>
            <br/>
            <label>Body:</label>
            <br/>
            <textarea className={"email-body"} rows={5} id={"body"}></textarea>
            <br/>
            <button className="btn btn-success" onClick={emailStudent}>Send</button>
            <Link to={"/class_detail"} state={{c_id: class_id}}>
                         <button className="btn btn-success">Back</button>
            </Link>





        </div>
    );
}

export default StudentEmail;