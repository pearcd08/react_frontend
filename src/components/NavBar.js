import React, {Fragment, useEffect, useState} from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from "axios";
import {BaseUrl} from "./constants";
import {useNavigate} from "react-router-dom";


function NavBar(props) {
    const [token, setToken] = useState("");
    const [hasToken, setHasToken] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem(token));
            setHasToken(true);
        }
    }, [token]);



    function logout() {
        let userToken = localStorage.getItem("token");
        axios.get(BaseUrl + "auth/logout/", {
            headers: {
                'Authorization': 'Token ' + userToken,

            }

        }).then(response => {
            console.log(response);
            localStorage.removeItem("token");
            setToken("");
            setHasToken(false);
            navigate("login");
            window.location.reload();
        }).catch(error => {
            console.log(error)
        })


    }


    return (
        <Fragment>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">Attendance System</Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="student_list">Students</Nav.Link>
                            <Nav.Link href="lecturer_list">Lecturers</Nav.Link>
                            <Nav.Link href="semester_list">Semesters</Nav.Link>
                            <Nav.Link href="course_list">Courses</Nav.Link>
                            <Nav.Link href="class_list">Classes</Nav.Link>
                            {hasToken ? <Nav.Link onClick={logout}>Logout</Nav.Link> :
                                <Nav.Link href="login">Login</Nav.Link>

                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Fragment>

    );
}

export default NavBar;