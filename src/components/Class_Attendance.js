import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";

function Attendance_Percentage(props) {
    const [percentage, setPercentage] = useState("");

    useEffect(() => {
        axios.get(BaseUrl + "student_class_attendance/"+props.classID+"/"+props.studentID+"/", {
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {

                setPercentage(response.data);

            }).catch(error => {
            console.log(error)
            setPercentage("0%")
        })
    }, []);

    return (
        <Fragment>
            {percentage}
        </Fragment>
    );
}

export default Attendance_Percentage;