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

    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [user, setUser] = useState("");
    const [hasAdmin, setAdmin] = useState(false)
    const [file, setFile] = useState();

    function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        axios.put(BaseUrl + "upload_students/", formData, {
            headers: {
                'content-type': 'multipart/form-data',
            }}).then((response) => {
            console.log(response.data);
        });

    }


        function fileHandler(event) {
            setFile(event.target.files[0])
        }


        return (

            <div className={"center-form"}>
                <form onSubmit={handleSubmit}>
                    <h3 className={"title"}>Upload Students</h3>
                    <input type="file" onChange={fileHandler}/>
                    <button type="submit">Upload File</button>
                </form>


            </div>
        )
            ;
    }

    export default StudentEmail;