import { UseRtcReceiver, UseRtcSender } from 'components/service/room/webrtc/NewWebRTC';
import { Sender } from 'components/service/room/webrtc/PeerWebRTC';
import WebSocketCore from 'components/service/room/websocket/WebSocketCore';
import { on } from 'process';
import { element } from 'prop-types';
import React, { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-bootstrap';
import CaptureButton from '../../../service/CaptureButton'; 
import { RoomTitle } from '../components/title';
import { WsResType } from '../model/ws_type';


let MyUserID=null;

  
let senders = new Array();  //sender
let receivers = new Array();  //receiver
let pcs = new Array(); //connected pcs. 

const BaseRoomPage = (props={path: "/api/room/xxx"}) => {
  const [myRoom, setMyRoom] = useState({access_id: "INVALID ROOM ID", users: {0:{id:0,username:"INVALID ROOM ID"},}})
  const [myUser, setMyUser] = useState({user_id: "INVALID USER ID", username: "user"})
  const [streams, setStreams] = useState(new Array()); //{user_id: stream}

  const streamRef = useRef(null);
  const socketRef = useRef(null);

  //websocket setting 
  const path = props.path;   
  const wsOnOpen = (socket) => {
    console.debug("websocket connection started.");
  }
  const wsOnMessage = (message) => {
    let res = JSON.parse(message);
    console.debug("wsResponse",res);

    switch(res.type){
      case WsResType.UserInfoResType:
        MyUserID=res.data.user.id;
        console.log("your user id is", MyUserID);
        setMyUser(res.data.user);
        break;
      case WsResType.RoomInfoResType:
        setMyRoom(res.data.room);
        //if(streamRef.current) offerRoomPeerRTC(Object.values(res.data.room.users)); //自分が配信中だったらリクエストをofferRtcする。
        break;
      case WsResType.RoomEnteredResType:
        setMyRoom(res.data.room);
        offerRoomPeerRTC(Object.values(res.data.room.users)); //入室したらリクエストを投げる
        break;
      case WsResType.RtcSenderOfferResType: 
        receiveSenderDescription(res.data);
        break; 
        case WsResType.RtcSenderCandidatesResType: 
        receiveSenderCandidates(res.data);
        break;
        case WsResType.RtcReceiverAnswerResType: 
        receiveReceiverDescription(res.data);
        break; 
        case WsResType.RtcReceiverCandidatesResType: 
        receiveReceiverCandidates(res.data);
        break; 
      default: 
        console.error("Unhandling response data", res);
        break;
    }
  };

  const wsOnClose = ()=>{
    console.log("websocket connection closed");
  };

  //when user info has changed 
  useEffect(()=>{
    console.debug("myUser", myUser);
  }, [myUser]);

  //when room info has changed 
  useEffect(()=>{
    console.debug("myRoom",myRoom);
  }, [myRoom]);

  //when socket is set 
  useEffect(()=>{
    console.debug("mySocketRef",socketRef.current);
  }, [socketRef]);

  //when streamEle is set
  useEffect(()=>{
    console.debug("streamEle", streams);
  }, [streams]);


  //部屋内の全てのユーザにRTCで通信する申請を出す。 
  const offerRoomPeerRTC = (users=[])=>{
    users.forEach((user)=>{
      if(user.id!=MyUserID) offerPeerRTC(user);
    });
  }

  const ontrack = (track, user_id) => {
    console.log("ontrack: kind", track.kind); 
    console.log("ontrack: track", track);
    let el = document.createElement(track.kind);
    //document.body.appendChild(el);
    let mediaStream = new MediaStream()
    mediaStream.addTrack(track);
    el.srcObject = mediaStream;
    el.autoplay = true;
    el.width=720;
    el.height=420;
    el.controls = true;

    setStreams((prev)=>([
      ...prev, 
      mediaStream
    ]));
  }

  const onConnectionSuccess = (user_id, pc) => {
    if(pcs[user_id]) pcs[user_id].close();
    pcs[user_id]=pc;
    console.debug("new peer connection established!!", pcs[user_id]);
  };

  const onConnectionStateChange = (state, user_id) => {
    console.debug("Connection State: ", state);
    switch(state){
      case "connected": 
        console.debug("CONNECTED");
        if(senders[user_id]){
          onConnectionSuccess(user_id, senders[user_id].pc);
          //delete(senders[user_id]);
        }else if(receivers[user_id]){
          onConnectionSuccess(user_id, receivers[user_id].pc);
          //delete(receivers[user_id]);
        }else{
          console.error("connected, but unhandled.")
        }
        break;
      case "disconnected":
        console.debug("DISCONNECTED");
        break;
      case "checking":
        console.debug("CHECKING");
        break;
      default:
        console.error("Unhandling state: ",state);
        break;
    }
  }

  const offerPeerRTC = (user)=>{
    console.log("OFFER RTC TOWARD USER", user.id)
    senders[user.id] = UseRtcSender(
      props={
        userID: user.id, 
        stream: streamRef.current, 
        socket: socketRef.current, 
        onTrack: (track) => ontrack(track, user.id),
        onConnectionStateChange: (state)=>onConnectionStateChange(state, user.id),
      } 
    );
    senders[user.id].offer().catch((e)=>{
        console.error(e);
    });
    console.log()
  }

  const receiveSenderDescription = (res) => {
    receivers[res.from_user_id] = UseRtcReceiver(
      props={
        userID: res.from_user_id,
        stream: streamRef.current,
        socket: socketRef.current,
        onTrack: (track) => ontrack(track, res.from_user_id),
        onConnectionStateChange: (state)=>onConnectionStateChange(state, res.from_user_id),
      }
    );
    receivers[res.from_user_id].onReceiveRemoteDescription(res.description);
  }
  const receiveSenderCandidates = (res) => {
    if(!receivers[res.from_user_id]) console.error("Not found receiver", res.from_user_id, receivers);
    receivers[res.from_user_id].onReceiveRemoteCandidates(res.candidates);
  }
  const receiveReceiverDescription = (res) => {
    if(!senders[res.from_user_id]) console.error("Not found sender", res.from_user_id, senders);
    senders[res.from_user_id].onReceiveRemoteDescription(res.description);
  }
  const receiveReceiverCandidates = (res) => {
    if(!senders[res.from_user_id]) console.error("Not found sender", res.from_user_id, senders);
    senders[res.from_user_id].onReceiveRemoteCandidates(res.candidates);
  }


  //on start capture
  const onStartCapture = (stream) => {
    console.debug("onStartCapture", pcs);

    offerRoomPeerRTC( Object.values(myRoom.users) );

    stream.getTracks().forEach(track => {
      Object.values(pcs).forEach((pc=>{
        pc.addTrack(track);
        console.debug("add track to pc: ", pc);
      }));
    }); 
  }

  //change my username
  const onChangeMyUserName = (e) => {
    console.debug(e.target.values);
    setMyUser((prev)=>(
      {
        id: prev.id, 
        username: e.target.value
      }
    ));
  }

  return (
    <div>
      <WebSocketCore path={path} onOpen={wsOnOpen} onMessage={wsOnMessage} onClose={wsOnClose} socketRef={socketRef}/>
      <RoomTitle roomid={myRoom?.access_id} />
      <div>
        <p>
          <small>my user id: {myUser?.id}</small>
        </p>
        <p>
          <small>my user name: <input defaultValue={myUser?.username} onChange={onChangeMyUserName}></input> </small>
        </p>
      </div>
      <hr />
      <div>
        <p>
        users: {
          Object.values(myRoom.users).map((user)=>{ 
            if(user.id!=MyUserID){
              return (
                <small>{user.id}:{user.username}, </small>
              )
            }
          })
        }
        </p>
      </div>
      <hr/>
      <div className='my-5'>
        <h3 style={{color:'blue',}}>Your</h3>
        <div>
          <CaptureButton streamRef={streamRef} onStartCapture={(stream)=>onStartCapture(stream)}/>
        </div>
      </div>
      <div className='my-5'>
        
        <h3>Others!</h3>
        { 
        Object.values(myRoom.users).map((user)=>{ 
          if(user.id!=MyUserID){
            return (
              <div className='my-3'>
                <p>
                  ({user.id}, {user.username}), 
                </p>
              </div>
            )
          }
        })
      }
      </div>
      <hr />
      <div className='my-5'>
        <h3>videos</h3>
        {
          //TODO: videoが誰のものかを分ける
          streams.map((stream)=>{
            return(
              <div>
                <p>stream</p>
                <video width={480} height={320} ref={(video)=>{ if(video) video.srcObject=stream}} autoPlay controls style={{border: "1px solid black"}}></video>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

  
  
  
export default BaseRoomPage;