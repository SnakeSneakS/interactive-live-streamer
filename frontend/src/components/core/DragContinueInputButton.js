import { once } from "process";

const DragContinueInputButton = (props={ FPS: 10 ,onInputContinue: (vector2)=>{console.debug(vector2);}, }) => {
    let fps = props.FPS ? props.FPS : 10;  

    //screenPosition
    let startPos = {x: 0, y: 0};
    let nowPos = {x: 0, y: 0}; 
    let diff2D = (prePos, nowPos) => { return {x:(nowPos.x-prePos.x), y:(nowPos.y-prePos.y)} }

    

    return (
        <button 
            className={props?.className} 
            style={props?.style}
            onMouseDown={(e)=>{
                //console.debug("onMouseDown", e); 
                startPos.x = e.screenX; startPos.y = e.screenY;
                nowPos.x = e.screenX; nowPos.y = e.screenY;

                let captureMouseMove = (mve) =>{
                    nowPos.x = mve.screenX; nowPos.y = mve.screenY;
                };

                let onInputContinueAction = setInterval( ()=>{
                    props?.onInputContinue( diff2D(startPos,nowPos) );
                } , 1000/fps );  

                //mousemove event
                document.addEventListener("mousemove", captureMouseMove);
                
                //mouseup event
                document.addEventListener("mouseup", ()=>{
                    document.removeEventListener("mousemove", captureMouseMove);
                    clearInterval(onInputContinueAction); 
                }, {once: true});
            }}
        >
            {props.children}
        </button>
    )
}

export default DragContinueInputButton; 

