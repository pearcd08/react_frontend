import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";


function SemesterOptions(props) {
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        axios.get(BaseUrl + "semester/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setSemesters(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, []);


    return (<Fragment>
            {semesters.map(semester =>
                <option value={semester.semester_id} key={semester.semester_id}>{semester.name} {semester.year}</option>)}
        </Fragment>);
}

export default SemesterOptions;