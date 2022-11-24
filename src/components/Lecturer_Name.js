import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";

function Lecturer_Name(props) {
    const [name, setName] = useState("");

    useEffect(() => {
        axios.get(BaseUrl + "lecturer_name_search/" + props.lecturerID+"/", {
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

export default Lecturer_Name;