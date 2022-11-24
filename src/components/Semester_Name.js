import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";

function Semester_Name(props) {
    const [name, setName] = useState("");

    useEffect(() => {
        axios.get(BaseUrl + "semester_name_search/" + props.semesterID+"/", {
            headers:
                {"Authorization": "Token " + localStorage.getItem("token")}
        })
            .then(response => {

                setName(response.data.name);

            }).catch(error => {
            console.log(error)
        })
    }, []);

    return (
        <Fragment>
            {name}
        </Fragment>
    );
}

export default Semester_Name;