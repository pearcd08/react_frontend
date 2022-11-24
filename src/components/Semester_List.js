import React, {useEffect, useState} from 'react';
import {BaseUrl} from "./constants";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {confirmAlert} from "react-confirm-alert";

function Semester_List(props) {
    const [semesters, setSemesters] = useState([]);
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [name, setName] = useState("");
    const [year, setYear] = useState("2022");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            setHasToken(true)
        }
    }, [])


    useEffect(() => {
        axios.get(BaseUrl + "semester/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setSemesters(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [semesters]);

    function saveSemester() {
        let data = {

            year: year, name: name

        };

        if (name.length > 0) {

            axios.post(BaseUrl + "semester_viewset/", data, {
                headers: {
                    "Authorization": "Token " + token
                }
            }).then(response => {
                alert("Create successfully")


            }).catch(error => {
                console.log(error)

            })


        } else {
            alert("Please enter a name");
        }


    }

    function deleteSemester(event) {
        let semester_id = event.target.value;

        axios.delete(BaseUrl + "semester/" + semester_id + "/", {
            headers: {
                "Authorization": "Token " + token
            }
        })
            .then(response => {
                alert("Semester has been deleted");
            }).catch(error => {
            console.log(error)
        })
    }

    function nameHandler(event) {
        setName(event.target.value);
    }

    function yearHandler(event) {
        setYear(event.target.value);
    }

    const confirmDelete = (event) => {

        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className={'popup-delete'}>
                        <h3>Delete this Semester?</h3>
                        <div className={"button-container"}>
                        <button className={"btn btn-primary"} onClick={onClose}>No</button>
                        <button className ={"btn btn-danger"}
                            onClick={() => {
                                deleteSemester(event);
                                onClose();
                            }}
                        >
                            Yes
                        </button>
                    </div>
                    </div>
                );
            }
        });
    }


    return (

        <div>

            <div className="input-form">
                <h2 className={"title"}>Create Semester</h2>


                <label>Name: </label>
                <br/>
                <input type={"text"} id={"name"} onChange={nameHandler}/>
                <br/>
                <label>Year: </label>
                <br/>
                <input type={"number"} id={"year"} min={2022} minLength={4} maxLength={4}
                       onKeyDown={(event) => {
                           event.preventDefault();
                       }}
                       defaultValue={2022} onChange={yearHandler}/>
                <br/>

                <button className={"btn btn-success"} onClick={saveSemester}>Save</button>

            </div>

            <div className="list-box">
                <h2 className={"title"}>Semesters</h2>
                <table className="table table-striped">
                    <tbody>
                    {semesters.map(semester =>
                        <tr scope="row" key={semester.semester_id}>
                            <td scope="col" className={"name-col-two"}>{semester.name} - {semester.year}</td>
                            <td scope="col">
                                <Link to={"/update_semester"} state={{sem_id: semester.semester_id}}>
                                    <button className={"btn btn-warning"}>Update</button>
                                </Link>

                                <button value={semester.semester_id} onClick={confirmDelete}
                                        className={"btn btn-danger"}>Delete
                                </button>
                            </td>
                    </tr>)}
                    </tbody>
                </table>

            </div>
        </div>


    );

}

export default Semester_List;