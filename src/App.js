import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Semester_List from "./components/Semester_List";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import Semester_Update from "./components/Semester_Update";
import Course_List from "./components/Course_List";
import Course_Update from "./components/Course_Update";
import Class_List from "./components/Class_List";
import Course_Options from "./components/Course_Options";
import Semester_Options from "./components/Semester_Options";
import Lecturer_List from "./components/Lecturer_List";
import Class_Detail from "./components/Class_Detail";
import Student_Detail from "./components/Student_Detail";
import CollegeDay_Detail from "./components/CollegeDay_Detail";
import Student_Email from "./components/Student_Email";
import Class_Update from "./components/Class_Update";
import Student_Update from "./components/Student_Update";
import Lecturer_Update from "./components/Lecturer_Update";
import Lecturer_Detail from "./components/Lecturer_Detail";
import {useEffect, useState} from "react";
import axios from "axios";
import {BaseUrl} from "./components/constants";
import Student_List from "./components/Student_List";
import Student_Upload from "./components/Student_Upload";


function App() {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const [hasAdmin, setAdmin] = useState(false);
    const [isStudent, setStudent] = useState(false);
    const [isLecturer, setLecturer] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setHasToken(true)
            axios.get(BaseUrl + "is_super_user/", {
                headers: {"Authorization": "Token " + localStorage.getItem("token")}
            }).then(response => {
                if (response.data.superuser === "true") {
                    setAdmin(true)
                    console.log("has admin")
                } else {
                    setAdmin(false)
                    console.log("no admin")
                }

            }).catch(error => {
                console.log(error)
            })
        } else {
            setHasToken(false);
        }
    }, []);
    useEffect(() => {
        axios.get(BaseUrl + "user_group/", {
            headers: {"Authorization": "Token " + localStorage.getItem("token")}
        }).then(response => {
            if (response.data.group === "student") {
                setStudent(true);

                console.log("student")
            } else if (response.data.group == "lecturer") {
                console.log("lecturer")
                setLecturer(true)
            }

        }).catch(error => {
            console.log(error)
        })

    }, []);

    return (<div className="App">
        <NavBar/>
        {hasAdmin ? <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="semester_list" element={<Semester_List/>}/>
                <Route path="update_semester" element={<Semester_Update/>}/>
                <Route path="semester" element={<Semester_Options/>}/>
                <Route path="course_list" element={<Course_List/>}/>
                <Route path="update_course" element={<Course_Update/>}/>
                <Route path="course" element={<Course_Options/>}/>
                <Route path="class_list" element={<Class_List/>}/>
                <Route path="class_detail" element={<Class_Detail/>}/>
                <Route path="class_update" element={<Class_Update/>}/>
                <Route path="lecturer_list" element={<Lecturer_List/>}/>
                <Route path="lecturer_update" element={<Lecturer_Update/>}/>
                <Route path="lecturer_detail" element={<Lecturer_Detail/>}/>
                <Route path="student_detail" element={<Student_Detail/>}/>
                <Route path="student_list" element={<Student_List/>}/>
                <Route path="student_update" element={<Student_Update/>}/>
                <Route path="student_email" element={<Student_Email/>}/>
                <Route path="student_upload" element={<Student_Upload/>}/>


            </Routes> :
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="login" element={<Login/>}/>

            </Routes>}
        {isLecturer ? <Routes>
            <Route path="class_list" element={<Class_List/>}/>
            <Route path="class_detail" element={<Class_Detail/>}/>
            <Route path="collegeday_detail" element={<CollegeDay_Detail/>}/>
            <Route path="student_email" element={<Student_Email/>}/>
            <Route path="collegeday_detail" element={<CollegeDay_Detail/>}/>
        </Routes> : ""}
        {isStudent ? <Routes>
            <Route path="student_list" element={<Student_List/>}/>
            <Route path="student_detail" element={<Student_Detail/>}/>

        </Routes> : ""}


    </div>);
}

export default App;
