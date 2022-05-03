import React, { useEffect, useState } from 'react'
import { Button, CardImg, Collapse } from 'react-bootstrap';
import adapter from 'webrtc-adapter'; //https://github.com/webrtcHacks/adapter 
import PeerWebRTC from './room/webrtc/PeerWebRTC';


//MediaStreamApi https://developer.mozilla.org/ja/docs/Web/API/Media_Streams_API


//const socket = new WebSocket(`${wsProtocol}://${hostname}:${port}`);
const CaptureButton = (props={ streamRef: null, onStartCapture: (stream)=>{console.log(stream);} }) => {

  let FPS = 10; 
  const [isFpsSettable, setIsFpsSettable] = useState(true);
  const [isShowMyCan, setIsShowMyCan] = useState(true);

  const [canSize, setCanSize] = useState({width: 0, height: 0, });
  const [canStyle, setCanStyle] = useState({ border: "3px solid black" });

  //console.log("isSecureContext: ", window.isSecureContext);
  const [isCapture, setIsCapture] = useState(false);

  const [can, setCan] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [videoPlayer, setVideoPlayer] = useState(null);

  
  useEffect(()=>{
    const can = document.getElementById("canvas");
    setCan(can); 
    const ctx = can.getContext("2d");
    setCtx(ctx);
    ctx.fillStyle = "rgb(128, 128, 128)";
    ctx.fillRect(0, 0, can.width, can.height); 
    const videoPlayer = document.getElementById("videoPlayer");
    setVideoPlayer(videoPlayer);

  }, [])

  //when removed, stop capturing
  useEffect(()=>{
    return(()=>{
      stopCapture(props.streamRef.current);
    })
  }, [])

  const handleClick = () => {
    //capture screen 
    if(!isCapture){
      startCapture().catch((err)=>{
        //console.error("Err", err);
      }).then((stream)=>{

        videoPlayer.srcObject = stream;
        //can.width=videoPlayer.srcObject.width;

        let drawInterval = (()=>{
          //STOP
          if(stream==null || !stream.active){
            setIsCapture(false);
            console.error("stream not active. Interval stopped!");
            return;
          }

          //Draw to small size canvas
          let canRatio = can.height / can.width; 
          let videoRatio = videoPlayer.videoHeight / videoPlayer.videoWidth;
          if(videoRatio > canRatio){
            let width = videoPlayer.videoWidth * (can.height / videoPlayer.videoHeight);
            ctx.drawImage(videoPlayer, (can.width-width)/2, 0, width , can.height)
          }else{
            let height = videoPlayer.videoHeight * (can.width / videoPlayer.videoWidth);
            ctx.drawImage(videoPlayer, 0, (can.height-height)/2 , can.width, height); 
          }

          //draw canvas equal size to video
          /*
          can.width = videoPlayer.videoWidth;
          can.height = videoPlayer.videoHeight;
          ctx.drawImage(videoPlayer, 0,0);
          */

          //Send to server 
          //https://developer.mozilla.org/ja/docs/Web/API/WebSocket
          //console.log("Send data to Server");
          //console.log("FPS", can.captureStream(FPS))

          //interval
          setTimeout(drawInterval, 1000/FPS);
        });
        drawInterval();

        //set Canvas Size
        setCanSize({width: 520, height: 380})

        //set stream
        //props.streamRef.current=stream;
        props.streamRef.current= can.captureStream(FPS); setIsFpsSettable(false); 
        props.onStartCapture(stream);
      });


    }
    //stop capturing 
    else{
      stopCapture(props.streamRef.current);
    }

    setIsCapture(!isCapture);    
  }

  //stop capturing 
  function stopCapture(stream){
    setCanSize({width: 0, height: 0})
    setIsFpsSettable(true);
    if(stream){
      stream.getTracks().forEach((track)=>{
        track.stop();
        console.debug("stop track", track);
      });
    }
    if(videoPlayer){
      videoPlayer.srcObject.getTracks().forEach((track) => {
        track.stop()
        console.debug("stop track", track);
      });
      videoPlayer.srcObject = null;
    }
    console.debug("stop capture", stream);
  }


  return (
      <div> 
        <video id="videoPlayer" autoPlay={true} width={0} height={0}></video>
        <div className="my-1"> 
          <p>settings: </p>
          <div className='my-1'>
            <span>video size: </span>
            <button className='btn btn-primary mx-2' onClick={()=>{ setCanSize({width: canSize.width-16, height: canSize.height}); }}>x-smaller</button>
            <button className='btn btn-primary mx-2' onClick={()=>{ setCanSize({width: canSize.width+16, height: canSize.height}); }}>x-bigger</button>
            <button className='btn btn-primary mx-2' onClick={()=>{ setCanSize({width: canSize.width, height: canSize.height-16}); }}>y-smaller</button> 
            <button className='btn btn-primary mx-2' onClick={()=>{ setCanSize({width: canSize.width, height: canSize.height+16}); }}>y-bigger</button> 
            <button className='btn btn-primary mx-2' onClick={()=>{ setCanSize({width: videoPlayer.videoWidth, height: videoPlayer.videoHeight}); }}>Fit to video</button> 
          </div>
          <div className='my-1'>
            <span>FPS: </span>
            <input type={"number"} min={1} max={60} defaultValue={FPS} disabled={!isFpsSettable} onChange={(e)=>{ 
              if(e.target.value < 1) e.target.value=1;
              else if(e.target.value > 60) e.target.value=60;
              FPS=e.target.value; 
            } }></input>
            {
              isFpsSettable?(<></>):(
            <small>: Can't change FPS while capturing...</small>)
            }
          </div>
        </div>
        <div className="my-1">
          {isShowMyCan?"":(<Button variant='link' onClick={ ()=>{setIsShowMyCan(!isShowMyCan)} } >show</Button>)}
          <Collapse in={isShowMyCan}>
            <canvas id="canvas" width={canSize.width} height={canSize.height} style={canStyle} onClick={()=>{setIsShowMyCan(!isShowMyCan)}}></canvas>
          </Collapse>
        </div>
        <input type="button" value={isCapture?"Stop Capture":"Capture"} id="capture" onClick={handleClick}/>
      </div>
  );
}

//default props
CaptureButton.defaultProps = {
  onStartCapture: (stream)=>{
    console.log("stream", stream);
  },
};



//for older browsers 
const forOldergetDisplayMedia = () => {
  //https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/getUserMedia
  
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  if (navigator.mediaDevices.getDisplayMedia === undefined) {
    navigator.mediaDevices.getDisplayMedia = function(constraints) {

      var getDisplayMedia = navigator.webkitgetDisplayMedia || navigator.mozgetDisplayMedia || navigator.msgetDisplayMedia;

     if (!getDisplayMedia) {
        return Promise.reject(new Error('getDisplayMedia is not implemented in this browser'));
      }

      // Otherwise, wrap the call to the old navigator.getDisplayMedia with a Promise
      return new Promise(function(resolve, reject) {
        getDisplayMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }
}



// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
// Browser Compatibility: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#browser_compatibility
async function startCapture() {
  let captureStream = null;

  try {
    forOldergetDisplayMedia();
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#parameters
      video: {
        cursor: "always"
      }, 
      audio: false /*{
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      } */
    });
  } catch(err) {
    // 1: https or localhost:8080 じゃないとエラー
    console.error("Error: " + err);
    throw err;
  }

  return captureStream;
}





export default CaptureButton;
