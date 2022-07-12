
import DragContinueInputButton from 'components/core/DragContinueInputButton';
import React from 'react'
import { Container, Row, Col, Button} from 'react-bootstrap';



//Control MMD model. 
const MMDModelController = (props = {setScale: (v)=>{}, setRotation: (v)=>{}, setPos: (v)=>{}, reset: ()=>{}} )=>{
    const inputFPS = 30;

    const btnClassName="btn";
    const xStyle={backgroundColor: "pink",};
    const yStyle={backgroundColor: "lightgreen",};
    const zStyle={backgroundColor: "lightblue",};

    const inputSensitivity = 0.001; 

    
    const handleScaleXInput = (vector) => {
        props?.setScale((prev)=>(
            {
                x: prev.x + vector.y*inputSensitivity, 
                y: prev.y, 
                z: prev.z
            } 
        ));
    };

    const handleScaleYInput = (vector) => {
        props?.setScale((prev)=> (
            {
                x: prev.x, 
                y: prev.y + vector.y*inputSensitivity, 
                z: prev.z
            } 
        ));
    };
    const handleScaleZInput = (vector) => {
        props?.setScale((prev)=>(
            {
                x: prev.x, 
                y: prev.y, 
                z: prev.z + vector.y*inputSensitivity
            } 
        ));
    };
    const handleRotationXInput = (vector) => {
        props?.setRotation((prev)=>(
            {
                x: prev.x + vector.y*inputSensitivity, 
                y: prev.y, 
                z: prev.z
            } 
        ));
    };
    const handleRotationYInput = (vector) => {
        props?.setRotation((prev)=>(
            {
                x: prev.x, 
                y: prev.y + vector.y*inputSensitivity, 
                z: prev.z
            } 
        ));
    };
    const handleRotationZInput = (vector) => {
        props?.setRotation((prev)=>(
            {
                x: prev.x, 
                y: prev.y, 
                z: prev.z + vector.y*inputSensitivity
            } 
        ));
    };
    const handlePosXInput = (vector) => {
        props?.setPos((prev)=> (
            {
                x: prev.x + vector.y*inputSensitivity, 
                y: prev.y, 
                z: prev.z
            } 
        ));
    };
    const handlePosYInput = (vector) => {
        props?.setPos((prev)=>(
            {
                x: prev.x, 
                y: prev.y + vector.y*inputSensitivity, 
                z: prev.z
            } 
        ));
    };
    const handlePosZInput = (vector) => {
        props?.setPos((prev)=>(
            {
                x: prev.x, 
                y: prev.y, 
                z: prev.z + vector.y*inputSensitivity
            } 
        ));
    };

    return (
        <div style={{border: "1px solid black"}} >
            <Container className="m-1">
                {/*
                <div className="my-2">
                    <Row> 
                        <Col>Scale</Col> 
                    </Row>
                    <Row>
                        <Col>
                            <DragContinueInputButton FPS={inputFPS} onInputContinue={handleScaleXInput} className={btnClassName} style={xStyle}>
                                <div>X</div>
                            </DragContinueInputButton>
                        </Col>
                        <Col>
                            <DragContinueInputButton FPS={inputFPS} onInputContinue={handleScaleYInput} className={btnClassName} style={yStyle}>
                                <div>Y</div>
                            </DragContinueInputButton>
                        </Col>
                        <Col>
                            <DragContinueInputButton FPS={inputFPS} onInputContinue={handleScaleZInput} className={btnClassName} style={zStyle}>
                                <div>Z</div>
                            </DragContinueInputButton>
                        </Col>
                    </Row>
                </div>
                */
                <div className="my-2">
                    <Row> 
                        <Col>Rotation</Col> 
                    </Row>
                    <Row>
                        <Col>
                            <DragContinueInputButton FPS={inputFPS} onInputContinue={handleRotationXInput} className={btnClassName} style={xStyle}>
                                <div>X</div>
                            </DragContinueInputButton>
                        </Col>
                        <Col>
                            <DragContinueInputButton FPS={inputFPS} onInputContinue={handleRotationYInput} className={btnClassName} style={yStyle}>
                                <div>Y</div>
                            </DragContinueInputButton>
                        </Col>
                        <Col>
                            <DragContinueInputButton FPS={inputFPS} onInputContinue={handleRotationZInput} className={btnClassName} style={zStyle}>
                                <div>Z</div>
                            </DragContinueInputButton>
                        </Col>
                    </Row>
                </div>
                }
                <div className="my-2">
                    <Row> 
                        <Col>Position</Col> 
                    </Row>
                    <Row>
                        <Col>
                            <DragContinueInputButton FPS={inputFPS} onInputContinue={handlePosXInput} className={btnClassName} style={xStyle}>
                                <div>X</div>
                            </DragContinueInputButton>
                        </Col>
                        <Col>
                            <DragContinueInputButton FPS={inputFPS} onInputContinue={handlePosYInput} className={btnClassName} style={yStyle}>
                                <div>Y</div>
                            </DragContinueInputButton>
                        </Col>
                        <Col>
                            <DragContinueInputButton FPS={inputFPS} onInputContinue={handlePosZInput} className={btnClassName} style={zStyle}>
                                <div>Z</div>
                            </DragContinueInputButton>
                        </Col>
                    </Row>
                </div>
                <div className="my-2">
                    <Row> 
                        <Col>Others</Col> 
                    </Row>
                    <Row>
                        <Col>
                            <button className='btn btn-sm btn-outline-danger' onClick={()=>{
                                props?.reset();
                            }}>
                                All Reset
                            </button>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    )

}

export default MMDModelController;