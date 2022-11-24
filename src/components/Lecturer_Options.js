import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import LecturerName from "./Full_Name";
import FullName from "./Full_Name";


function LecturerOptions(props) {
    const [lecturers, setLecturers] = useState([]);

    useEffect(() => {
        axios.get(BaseUrl + "lecturer/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setLecturers(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [lecturers]);


    return (<Fragment>
            {lecturers.map(lecturer =>
                <option value={lecturer.lecturer_id} key={lecturer.lecturer_id}> <FullName userID={lecturer.user}/></option>)}
        </Fragment>);
}

export default LecturerOptions;