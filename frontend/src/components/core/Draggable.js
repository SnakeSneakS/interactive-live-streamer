import { useState } from "react";
import { Button } from "react-bootstrap";

//TODO make this draggable
const Draggable = (props = {handler: document.body,}) => {
    const [isDragging, setIsDragging] = useState();
    const [pos, setPos] = useState({x:0,y:0});

    const onMouseDown = () => {

    }

    console.debug(props.children);

    return (
        <div>
            <Button className="btn btn-sm"> 
                ✋
            </Button>
            <div draggable={true} style={{opacity: 1, }}>
                {props.children}
            </div>
            <div style={{position: "absolute", left: pos.x, top: pos.y}}>
                {props.children}
            </div>
        </div>
    )
}

export default Draggable; 
