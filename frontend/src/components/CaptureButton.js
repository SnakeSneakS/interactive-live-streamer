import React, { useEffect, useState } from 'react'
import adapter from 'webrtc-adapter'; //https://github.com/webrtcHacks/adapter 

const FPS = 5; 

const wsProtocol = "ws"; //wss
const hostname = "localhost";
const port = "80"; //if wss, port 433 

//const socket = new WebSocket(`${wsProtocol}://${hostname}:${port}`);

const CaptureButton = () => {
  const [canSize, setCanSize] = useState({width: 520, height: 380, });
  const [canStyle, setCanStyle] = useState({ border: "10px solid black" });

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
  })

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

          //Draw
          let canRatio = canSize.height / canSize.width; 
          let videoRatio = videoPlayer.videoHeight / videoPlayer.videoWidth;
          if(videoRatio > canRatio){
            let width = videoPlayer.videoWidth * (canSize.height / videoPlayer.videoHeight);
            ctx.drawImage(videoPlayer, (canSize.width-width)/2, 0, width , canSize.height)
          }else{
            let height = videoPlayer.videoHeight * (canSize.width / videoPlayer.videoWidth);
            ctx.drawImage(videoPlayer, 0, (canSize.height-height)/2 , canSize.width, height); 
          }

          //Send to server 
          //https://developer.mozilla.org/ja/docs/Web/API/WebSocket
          console.log("Send data to Server");
          console.log(stream);

          //interval
          setTimeout(drawInterval, 1000/FPS);
        });
        drawInterval();
      });

    }
    //stop capturing 
    else{
      let tracks = videoPlayer.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoPlayer.srcObject = null;
    }

    setIsCapture(!isCapture);    
  }

  return (
      <div>
        <video id="videoPlayer" autoPlay={true} width={0} height={0}></video>
        <div>
          <canvas id="canvas" width={canSize.width} height={canSize.height} style={canStyle}></canvas>
        </div>
        <input type="button" value={isCapture?"Stop Capture":"Capture"} id="capture" onClick={handleClick}/>
      </div>
  );
}

// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
// Browser Compatibility: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#browser_compatibility
async function startCapture() {
  let captureStream = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#parameters
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
