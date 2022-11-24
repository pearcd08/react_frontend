import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";
import LecturerName from "./Full_Name";
import FullName from "./Full_Name";
import CourseName from "./Course_Name";


function ClassOptions(props) {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        axios.get(BaseUrl + "class/" ,{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setClasses(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, []);


    return (<Fragment>
            {classes.map(classoption =>
                <option value={classoption.class_id} key={classoption.class_id}> {classoption.number} - <CourseName courseID={classoption.course}/></option>)}
        </Fragment>);
}

export default ClassOptions;