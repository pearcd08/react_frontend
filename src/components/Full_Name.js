import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "./constants";

function FullName(props) {
    const [name, setName] = useState("");

    useEffect(() => {
        axios.get(BaseUrl + "user/" + props.userID + "/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {

                setName(response.data.first_name +" "+response.data.last_name);

            }).catch(error => {
            console.log(error)
        })
    }, [name]);

    return (
        <Fragment>
            {name}
        </Fragment>
    );
}

export default FullName;