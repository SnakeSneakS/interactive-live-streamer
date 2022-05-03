import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormGroup, InputGroup, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import CaptureButton from 'components/service/CaptureButton'; 
import { RoomTitle } from '../components/title';
import BaseRoomPage from '../components/BaseRoomPage';

//props - [roomid, ]

const JoinRoomPage = () => {
  const [roomid, setRoomId] = useState("")

  let params = useParams();
  return params.roomid?(
    <div>
      <BaseRoomPage path={"/api/room/join/"+params.roomid}/>
    </div>
  ):(
    <div>
      <Container>
        <Row className='my-3'>
          <h1>Input room id!</h1>
        </Row>
        <Row >
          <Form>
            <Row>
              <Col lg={2}></Col>
              <Col xs={12} lg={7} className='my-2'>
                <FormGroup controlId='roomid'>
                  <Form.Control type="text" placeholder='room id' value={roomid} onChange={(e)=>{setRoomId(e.target.value)}}></Form.Control>
                </FormGroup>
              </Col>
              <Col xs={12} lg={1} className='my-2'>
                <Link to={roomid} className="btn btn-primary" variant="primary" type="submit" >Enter</Link>
              </Col>
              <Col lg={2}></Col>
            </Row>
          </Form>
        </Row>
        <Row className='mt-5'>
          <hr
          style={{ color: "white",  backgroundColor: "black",  height: 3}}
          />
        </Row>
        <Row >
          <Row>
            <Col>
              <h1>Display joinable rooms!</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Not yet...</p>
            </Col>
          </Row>
        </Row>
      </Container>

    </div>
  )
}

export default JoinRoomPage;
