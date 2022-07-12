
import MMDViewer from 'components/service/mmd/mmd-viewer';
import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//TestPage
const TestPage = () =>{

    return(
        <div>
            <Container>
                <Row>
                    <h1>MMD VIEW TEST</h1>
                </Row>
                <Row>
                    <MMDViewer />    
                </Row>
            </Container>
        </div>
    )
}

export default TestPage;


