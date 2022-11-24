import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import axios from "axios";
import {BaseUrl} from "./constants";
import Lecturer_Name from "./Lecturer_Name";
import FullName from "./Full_Name";
import Course_Name from "./Course_Name";

function ClassDetail(props) {
    const location = useLocation();
    const lecturer_id = location.state.l_id;
    const user_id = location.state.u_id;
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [lecturer, setLecturer] = useState([]);
    const [user, setUser] = useState([]);
    const [lecturerClasses, setLecturerClasses] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0)


    //get Lecturer details
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setHasToken(true);

            axios.get(BaseUrl + "lecturer/" + lecturer_id + "/", {
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                setLecturer(response.data);

            }).catch(error => {
                console.log(error)
            })
        } else {
            setHasToken(false);
        }
    }, []);

        //get user details
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setHasToken(true);

            axios.get(BaseUrl + "user/" + user_id + "/", {
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                setUser(response.data);

            }).catch(error => {
                console.log(error)
            })
        } else {
            setHasToken(false);
        }
    }, []);



    //get lecturer's assigned classes
    useEffect(() => {
        axios.get(BaseUrl + "lecturer_class_list/" + lecturer_id + "/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setLecturerClasses(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [refreshKey]);

    //get classes with no lecturer
    useEffect(() => {
        axios.get(BaseUrl + "available_class_list/",{
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            })
            .then(response => {
                setAvailableClasses(response.data)
            }).catch(error => {
            console.log(error)
        })
    }, [refreshKey]);


    //assign lecturer
    function assignLecturer(event) {
        let login_token = localStorage.getItem("token");
        let class_id = event.target.value;

        axios.post(BaseUrl + "assign_lecturer/" + class_id + "/" + lecturer_id + "/", "",{
            headers: {
                "Authorization": "Token " + login_token
            }
        }).then(response => {
            setRefreshKey(oldKey => oldKey + 1);


        }).catch(error => {
            console.log(error)

        })

    }

    //withdraw lecturer
    function withdrawLecturer(event) {
        let login_token = localStorage.getItem("token");
        let class_id = event.target.value;

        axios.delete(BaseUrl + "withdraw_lecturer/" + class_id + "/", {
            headers: {
                "Authorization": "Token " + login_token
            }
        }).then(response => {
            setRefreshKey(oldKey => oldKey + 1);


        }).catch(error => {
            console.log(error)

        })

    }


    return (<div>






            <div className={"center-form"}>
                <h3 className={"title"}>Lecturer Details</h3>
                <br/>
                <p className={"title"}> Name: <FullName userID={user_id}/></p>
                <p className={"title"}> Email: {user.email}</p>
                <p className={"title"}> Username: {user.username}</p>
                <p className={"title"}> D.O.B: {lecturer.dob}</p>
                <br/>
                <br/>


                <h5> <FullName userID={user_id}/>'s Classes</h5>
                <table className="table table-striped">
                    <tbody>

                    {lecturerClasses.map(lc => <tr scope="row" key={lc.class_id}>
                        <td scope="col" className={"name-col"}>{lc.number} - <Course_Name courseID={lc.course}/>
                        </td>
                        <td scope="col">
                            <button className={"btn btn-danger"} value={lc.class_id}
                                    onClick={withdrawLecturer}>Withdraw
                            </button>
                        </td>
                    </tr>)}
                    </tbody>
                </table>
                <h5> Available Classes</h5>
                <table className="table table-striped">
                    <tbody>

                    {availableClasses.map(ac => <tr scope="row" key={ac.class_id}>
                        <td scope="col" className={"name-col"}>{ac.number} - <Course_Name courseID={ac.course}/>
                        </td>
                        <td scope="col">
                            <button className={"btn btn-success"} value={ac.class_id}
                                    onClick={assignLecturer}>Assign
                            </button>
                        </td>
                    </tr>)}
                    </tbody>
                </table>
                <Link to={"/lecturer_list"}>
                    <button className={"btn btn-warning"}>Back</button>
                </Link>
            </div>

        </div>


    );
}

export default ClassDetail;