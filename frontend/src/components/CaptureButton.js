import React, { useEffect, useState } from 'react'
import adapter from 'webrtc-adapter'; //https://github.com/webrtcHacks/adapter 

const CaptureButton = () => {
  //console.log("isSecureContext: ", window.isSecureContext);

  const canWidth=1280;
  const canHeight=720;

  const [isCapture, setIsCapture] = useState(false);


  const [ctx, setCtx] = useState(null);
  const [videoPlayer, setVideoPlayer] = useState(null);
  useEffect(()=>{
    const can = document.getElementById("canvas");
    const ctx = can.getContext("2d");
    setCtx(ctx);
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
        setInterval(()=>{
          ctx.drawImage(videoPlayer, canWidth, canHeight);
        }, 200);
      });

    }
    //stop capturing 
    else{

      alert("Capture Stopped");

    }

    setIsCapture(!isCapture);    
  }

  return (
      <div>
        <video id="videoPlayer" autoPlay={true}></video>
        <canvas id="canvas" width={canWidth} height={canHeight}></canvas>
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
      video: true, 
      audio: false 
    });
  } catch(err) {
    // 1: https or localhost:8080 じゃないとエラー
    console.error("Error: " + err);
    throw err;
  }

  return captureStream;
}

export default CaptureButton;
