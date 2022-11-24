import React, {useEffect, useState} from 'react';
import {BaseUrl} from "./constants";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {confirmAlert} from "react-confirm-alert";

function Course_List(props) {
    const [courses, setCourses] = useState([]);
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            setHasToken(true)
        }
    }, [])


    useEffect(() => {
        axios.get(BaseUrl + "course/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setCourses(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [courses]);

    function saveCourse() {
        let data = {
            code: code, name: name

        };

        if (code.length > 0 && name.length > 0) {
            axios.post(BaseUrl + "course_viewset/", data, {
                headers: {
                    "Authorization": "Token " + token
                }
            }).then(response => {
                alert("Course Create successfully")


            }).catch(error => {
                console.log(error)

            })
        } else {
            alert("Enter all values")
        }


    }

    function deleteCourse(event) {
        let course_id = event.target.value;
        axios.delete(BaseUrl + "course/" + course_id + "/", {
            headers: {
                "Authorization": "Token " + token
            }
        })
            .then(response => {
                alert("Course has been deleted");
            }).catch(error => {
            console.log(error)
        })
    }


    function codeHandler(event) {
        setCode(event.target.value);
    }

    function nameHandler(event) {
        setName(event.target.value);
    }

      const confirmDelete = (event) => {

        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className={'popup-delete'}>
                        <h3>Delete this Course?</h3>
                        <div className={"button-container"}>
                        <button className={"btn btn-primary"} onClick={onClose}>No</button>
                        <button className ={"btn btn-danger"}
                            onClick={() => {
                                deleteCourse(event);
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
            <div className={"input-form"}>
                <h2 className={"title"}>Create Course</h2>

                <label>Code:</label>
                <br/>
                <input type={"text"} id={"code"} maxLength={4} onChange={codeHandler}/>
                <br/>
                <label>Name:</label>
                <br/>
                <input type={"text"} id={"name"} onChange={nameHandler}/>
                <br/>
                <button className={"btn btn-success"} onClick={saveCourse}>Save</button>
            </div>


            <div className="list-box">
                <h2 className={"title"}>Courses</h2>
                <table className="table table-striped">
                    <tbody>
                    {courses.map(Course =>
                        <tr>
                            <td scope="row" key={Course.course_id}>
                                <td scope="col" className={"name-col-two"} key={Course.course_id}>{Course.code} - {Course.name}</td>
                                <td scope="col">
                                    <Link to={"/update_Course"} state={{c_id: Course.course_id}}
                                          className={"btn btn-warning"}>Update</Link>
                                    <button value={Course.course_id} onClick={confirmDelete}
                                            className={"btn btn-danger"}>Delete
                                    </button>
                                </td>
                            </td>
                        </tr>)}
                    </tbody>
                </table>

            </div>
        </div>


    );

}

export default Course_List;