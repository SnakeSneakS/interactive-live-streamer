import { useCallback } from "react"
import { useEffect, useRef, useState } from "react"
import process from "process"
import { Alert } from 'react-bootstrap';


// https://developer.mozilla.org/ja/docs/Web/API/WebSocket 
const WebSocketCore = ( props = {}) => {
    const hostname=process.env.REACT_APP_SERVER_HOSTNAME
    const port=process.env.REACT_APP_SERVER_PORT
    const url = `ws://${hostname}:${port}${props.path}`

    const [isWsError, setIsWsError] = useState(false);
 
    
    useEffect(()=>{
        console.debug(`WEBSOCKET SERVER URL: ${url}`)  
        setIsWsError(false);
        props.socketRef.current = new WebSocket(url);
        if(!props.socketRef.current){ throw new Error("websocket failed to create...") }
    
        //when connected
        props.socketRef.current.onerror = (e)=>{
            console.error("Error when using websocket.", e);
            setIsWsError(true);
        };

        //when receive message
        props.socketRef.current.opened = ()=>{
            console.debug("closed websocket connection.");
            props.onOpen(props.socketRef.current);
        };

        //when closed
        props.socketRef.current.onclose = ()=>{
            console.debug("closed websocket connection.");
            props.onClose();
        };

        //when received message
        props.socketRef.current.onmessage = (e)=>{
            props.onMessage(e.data);
        }

        return(()=>{
            onUnmount();
        })
    },[]);

    //send message
    const sendMessage = useCallback((message)=>{
        props.socketRef.current?.send( JSON.stringify({message}) );
    }, []);

    //when unmount
    const onUnmount = ()=>{
        console.debug("unmounting...")
        props.socketRef.current.close();
        props.socketRef.current=null;
    }

    return (
        <div>
            <div>
            { 
                (!isWsError)?<></>:(
                    <Alert Key={"danger"} variant={"danger"}>
                        <Alert.Heading>Error: when connecting to server with websocket</Alert.Heading> 
                    </Alert>
                )
            }
            </div>
        </div>
    );
}

WebSocketCore.defaultProps = {
    path: "/", 
    onOpen: (socket)=>{
        socket.send("Helloe server!");
    }, 
    onMessage: (message)=>{
        console.log("message from server",message);
    }, 
    onClose: ()=>{ 
        console.log("websocket connection closed");
    }, 
    socketRef: null,
}


export default WebSocketCore;

