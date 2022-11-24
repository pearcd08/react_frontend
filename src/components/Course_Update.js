import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";


function UpdateCourse(props) {
    const location = useLocation();
    const course_id = location.state.c_id;
    const [course, setCourse] = useState({});
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        axios.get(BaseUrl + "course/" + course_id + "/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setCourse(response.data);
                setCode(response.data.code);
                setName(response.data.name);
            }).catch(error => {
            console.log(error)
        })
    }, [])

    function updateCourse() {
        let login_token = localStorage.getItem("token");

        let data = {
            code: code,
            name: name

        };

        if(code.length > 0 && name.length > 0){
             axios.put(BaseUrl + "course/" + course_id + "/", data, {
            headers: {
                "Authorization": "Token " + login_token
            }
        }).then(response => {
            navigate("/Course_list");
            alert("Update successfully");


        }).catch(error => {
            console.log(error)
        })
        }
        else{
            alert("Enter all values!")
        }


    }


    function codeHandler(event) {
        setCode(event.target.value);
    }

    function nameHandler(event) {
        setName(event.target.value);
    }


    return (
        <div className={"center-form"}>
            <h2 className={"title"}>Update Course</h2>
            <label>Code: </label>
            <br/>
            <input type={"text"} id={"code"} value={code} onChange={codeHandler}/>
            <br/>
            <label>Name: </label>
            <br/>
            <input type={"text"} id={"name"} value={name} onChange={nameHandler}/>
            <br/>
            <button className={"btn btn-success"} onClick={updateCourse}>Update</button>

            <Link to={"/course_list"}>
                   <button className={"btn btn-warning"} >Back</button>
            </Link>

        </div>

    );
}

export default UpdateCourse;