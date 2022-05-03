import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//HomePage
const HomePage = () =>{

    return(
        <div>
            <Container>
                <Row>
                    <h1>Which?</h1>
                </Row>
                <Row>
                    <Col lg={6} xs={12} className="p-3">
                        <div className='d-grid gap-2'> 
                            <Link to="/room/create" className='d-grid gap-2' style={{textDecoration: "none", height: "5rem"}}>
                                <OverlayTrigger placement='top' delay={{show: 250, hide: 400}} overlay={<Tooltip id="button-tooltip">Create a room as a owner.</Tooltip>}>
                                    <Button variant='outline-primary' size="lg" style={{fontSize: "3rem"}}>create</Button>
                                </OverlayTrigger>
                            </Link>
                        </div>
                    </Col>  
                    <Col lg={6} xs={12} className="p-3">
                        <div className='d-grid gap-2'> 
                            <Link to="/room/join" className='d-grid gap-2' style={{textDecoration: "none", height: "5rem"}}>
                            <OverlayTrigger placement='top' delay={{show: 250, hide: 400}} overlay={<Tooltip id="button-tooltip">Join a room as a listener.</Tooltip>}>
                                    <Button variant='outline-primary' size="lg" style={{fontSize: "3rem"}}>join</Button>
                                </OverlayTrigger>
                            </Link>
                        </div>
                    </Col>    
                </Row>
            </Container>
        </div>
    )
}

export default HomePage;


