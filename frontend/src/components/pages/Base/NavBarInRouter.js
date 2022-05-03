import React from "react"
import { Navbar, Nav, Container, Button, Col, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";

const MyNavBarInRouter = () => {
    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Link to="/" className="navbar-brand"><Navbar.Brand>Home</Navbar.Brand></Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto"></Nav>
                        <Nav>
                            <Row>
                                <Col xs={4} ></Col>
                                <Col xs={2} lg={4}>
                                    <Link to="/room/create" className="m-1">
                                        <Button variant="outline-secondary" active>
                                            create
                                        </Button>
                                    </Link>
                                </Col>
                                <Col xs={2} lg={4}>
                                    <Link to="/room/join" className="m-1">
                                        <Button variant="outline-secondary" active>
                                            join
                                        </Button>
                                    </Link>
                                </Col>
                                <Col xs={4} ></Col>
                            </Row>
                            
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}


export default MyNavBarInRouter;
