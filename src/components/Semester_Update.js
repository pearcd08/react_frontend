import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";


function UpdateSemester(props) {
    const location = useLocation();
    const sem_id = location.state.sem_id;
    const [semester, setSemester] = useState({});
    const [name, setName] = useState("");
    const [year, setYear] = useState("");
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        let login_token = localStorage.getItem("token");
        axios.get(BaseUrl + "semester/" + sem_id + "/", {
            headers: {
                "Authorization": "Token " + login_token
            }
        })
            .then(response => {
                setSemester(response.data);
                setName(response.data.name);
                setYear(response.data.year);
            }).catch(error => {
            console.log(error)
        })
    }, [])

    function updateSemester() {
        let login_token = localStorage.getItem("token");

        let data = {
            name: name, year: year,

        };

        if (name.length > 0 && year.length > 0) {
            axios.put(BaseUrl + "semester/" + sem_id + "/", data, {
                headers: {
                    "Authorization": "Token " + login_token
                }
            }).then(response => {
                navigate("/semester_list");
                alert("Update successfully");


            }).catch(error => {
                console.log(error)
            })

        } else {
            alert("Fill in all fields")
        }


    }

    function nameHandler(event) {
        setName(event.target.value);
    }

    function yearHandler(event) {
        setYear(event.target.value);
    }


    return (<div>


            <h2 className="title3">Update Semester</h2>
            <div className={"center-form"}>


                <label>Title:</label>
                <br/>
                <input type={"text"} id={"name"} value={name} onChange={nameHandler}/>
                <br/>
                <label>Year: </label>
                <br/>
                <input type={"number"} id={"year"} value={year} min={2022} minLength={4} maxLength={4}
                       onKeyDown={(event) => {
                           event.preventDefault();
                       }}
                       defaultValue={2022} onChange={yearHandler}/>
                <br/>

                <button className={"btn btn-success"} onClick={updateSemester}>Save</button>
                <Link to="/semester_list">
                    <button className={"btn btn-warning"}>Back</button>
                </Link>

                <br/>
            </div>
        </div>

    );
}

export default UpdateSemester;