import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";

function CourseName(props) {
    const [name, setName] = useState("");

    useEffect(() => {
        axios.get(BaseUrl + "course/" + props.courseID + "/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
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

export default CourseName;