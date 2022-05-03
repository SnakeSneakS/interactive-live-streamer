import { WsReqType, WsResType } from "components/pages/Room/model/ws_type";
import { Receiver, Sender } from "./PeerWebRTC"

export const UseRtcSender = (props={userID: 0, stream: null, socket: null, onTrack: (track)=>{}, onConnectionStateChange: (state)=>{console.log(state);}}) => {
    let sender = new Sender(
        props.stream, 
        (track)=>{props.onTrack(track);},
        (candidates)=>{
            console.debug("send candidates", candidates);
            props.socket.send(
                JSON.stringify(
                    {   
                        type: WsReqType.RtcSenderCandidatesReqType,
                        data: {
                            to_user_id: props.userID, 
                            candidates: candidates 
                        }
                    }
                )
            );
        },
        (description)=>{
            console.debug("send description", description);
            props.socket.send(
                JSON.stringify(
                    {   
                        type: WsReqType.RtcSenderOfferReqType,
                        data: {
                            to_user_id: props.userID, 
                            description: description 
                        }
                    }
                )
            )
        },
        (state)=>{
            props.onConnectionStateChange(state);
        }
    );
    return sender;
}



export const UseRtcReceiver = (props={userID: 0, stream: null, socket: null, onTrack: (track)=>{}}) => {
    let receiver = new Receiver(
        props.stream, 
        (track)=>{props.onTrack(track);},
        (candidates)=>{
            console.debug("send candidates", candidates);
            props.socket.send(
                JSON.stringify(
                    {   
                        type: WsReqType.RtcReceiverCandidatesReqType,
                        data: {
                            to_user_id: props.userID, 
                            candidates: candidates 
                        }
                    }
                )
            );
        },
        (description)=>{
            console.debug("send description", description);
            props.socket.send(
                JSON.stringify(
                    {   
                        type: WsReqType.RtcReceiverAnswerReqType,
                        data: {
                            to_user_id: props.userID, 
                            description: description 
                        }
                    }
                )
            );
        },
        (state)=>{
            props.onConnectionStateChange(state);
        }
    );
    return receiver;
}

