
import React, { useEffect, useState, useRef, Suspense } from 'react'
import { Container, Row, Col, Button, OverlayTrigger, Tooltip, InputGroup, Alert } from 'react-bootstrap';

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'


import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader'
import { MyMMDLoader } from './loader/MyMMDLoader'
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper'
import { MMDPhysics } from 'three/examples/jsm/animation/MMDPhysics'
import DragContinueInputButton from 'components/core/DragContinueInputButton';
import MMDModelController from './controller/MMDModelController';
import Draggable from 'components/core/Draggable';


//MmdViewer
//refer to https://github.com/negimasato/react-mmd-viewer 

//TODO: display texture!! 

const FPS = 1;
const InputFPS = 1; 

const MMDViewer = () =>{

    const canSize = {width: 512, height: 512};

    const [errorMsg, setErrorMsg] = useState(null);
    
    const [MMDMeshData, setMMDMeshData] = useState(null); 
    const [MMDScaleData, setMMDScaleData] = useState(null);
    const [MMDRotationData, setMMDRotationData] = useState(null);
    const [MMDPositionData, setMMDPositionData] = useState();
    const vector2list = (vector) => [vector.x, vector.y, vector.z];

    const reset = ()=>{
        setMMDScaleData({x:0.2, y:0.2, z:0.2});
        setMMDRotationData({x:0, y:0, z:0});
        setMMDPositionData({x:0, y:-3, z:0});
    }
    
    useEffect(()=>{
        reset();
    }, [])
    

    //const mmd = useLoader( MyMMDLoader, "/mmd/MMD企画.pmx");
    /*
    useEffect(()=>{
        new MyMMDLoader().load(
            "/mmd/snakesneaks-mmd-model.pmx", 
            (mesh)=>{
                console.debug(mesh);
                setMMDMeshData(mesh);
            }, 
            (xhr)=>{},
            (e)=>{console.error(e);},
            "pmx"
        )
    }, [])  */

    //update mmd frame
    let isStop;
    useEffect(()=>{
        let t;
        let draw = () => {
            console.log("drawing");
            t=setTimeout(draw, 1000/FPS);
        }
        draw();

        return (()=>{
            clearTimeout(t);
        }); 
    },[])


    //TODO: Load Texture, Motion Track, Position Control
    const onInputMMDModel = (e)=>{
        setErrorMsg(null);

        //console.debug(e);
        let files = e.target.files;
        if( files !== undefined && files !== null ) {

            //for(let i = 0; i < files.length; ++i){
            if(files[0]){ let i=0;
                let file = files[i];

                let file_name = file.name;
                let file_extension = file_name.split('.').pop();
                let objectUrl = URL.createObjectURL( file ) ;
                console.debug("url for file\n", file_name, ":", objectUrl);

                if(file_extension==="pmx" || file_extension==="pmd"){
                    console.debug("try to load mmd file..."); 

                    let loader = new MyMMDLoader();
                    loader.load(
                        objectUrl, 
                        (mesh)=>{
                            console.debug("loaded file:", mesh);
                            setMMDMeshData(mesh);
                        }, 
                        (xhr)=>{
                            console.debug("is in progress... | ", (xhr.loaded/xhr.total)*100, "%");
                        }, 
                        (e)=>{
                            console.error(e);
                            setErrorMsg(e); 
                        }, 
                        file_extension
                    );
                }else{
                    let thisErrorMessage="invalid file extention. use .pmx or .pmd file";
                    setErrorMsg(thisErrorMessage); 
                    console.error(thisErrorMessage); 
                }

                URL.revokeObjectURL(); //revoke file (url)  
        　　}
        }
    }


    return(
        <div>
            <div>
                {
                    errorMsg===null?<></>:
                    <Alert key={"danger"} variant={"danger"}>
                        <Alert.Heading>failed to load mmd data.</Alert.Heading>
                        <div>
                            <p>{errorMsg}</p>
                        </div>
                    </Alert>
                }
                
            </div>
            <div className='m-3'>
                <label>
                    Input Your Custom MMD Data: <input type={"file"} accept={[".pmd", ".pmx"]} onChange={onInputMMDModel} /> 
                </label>
            </div>
            <div >
                <Container>
                    <Row>
                        <Col>
                            <Canvas width={canSize.width} height={canSize.height} style={{border: "1px solid black", width:canSize.width, height:canSize.height }}>
                                <ambientLight />
                                <pointLight position={[10, 10, 10]} />
                                <Box position={[-1.2, 0, 0]} />
                                <Box position={[1.2, 0, 0]} />
                                {
                                    MMDMeshData===null ? <></> : 
                                        <primitive object={MMDMeshData} dispose={null} scale={vector2list(MMDScaleData)} rotation={vector2list(MMDRotationData)} position={vector2list(MMDPositionData)}></primitive>  
                                        //<mesh geometry={MMDMeshData}></mesh>
                                }   
                            </Canvas>
                        </Col>
                        <Col>
                                <InputGroup>
                                    <div>
                                        <MMDModelController setScale={setMMDScaleData} setRotation={setMMDRotationData} setPos={setMMDPositionData} reset={reset}></MMDModelController>
                                    </div>
                                </InputGroup>
                        </Col>
                    </Row>
                </Container>                
            </div>
            <div>
                <Draggable>
                    <div>
                        draggable
                    </div>
                </Draggable> 
            </div>
        </div>
    )
}



//Box as tutorial
const  Box = (props) => {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
    // Return view, these are regular three.js elements expressed in JSX
    return (
      <mesh
        {...props}
        ref={mesh}
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
  }
  



export default MMDViewer;


