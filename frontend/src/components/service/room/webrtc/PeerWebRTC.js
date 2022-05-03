//参考: https://www.cyberowl.co.jp/blog/technology/331 など
//https://qiita.com/massie_g/items/f5baf316652bbc6fcef1#%E7%B0%A1%E6%98%93%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AA%E3%83%B3%E3%82%B0%E3%81%AE%E4%BB%95%E7%B5%84%E3%81%BF ではanswerにcandidatesを含めることで通信を簡単にしている.

import { off } from "process";
import { propTypes } from "react-bootstrap/esm/Image";


/*

//How to connect WebRTC peer-to-peer connection

--- --- --- 

~ description ~

1. senderのdescription, を保存しreceiverに渡す。
2. receiverが1.の情報を受け取り，自身のdescriptionと結合してanswerを返す
3. senderでanswerを登録すればよし

x. お互いのcandidatesをそれぞれ調べlocalに保存。相手のcandidatesをそれぞれ追加し、candidatesの情報が全て揃う。

--- --- --- 

~ program ~

1. new Sender().offer();
2. new Receiver()... when received 1. , run onReceiveRemoteDescription() 
3. when receiver 2. , run onReceiveRemoteDescription() 

*/


class baseWebRTC {
    stream; 
    pc; 
    sendCandidates;
    sendDescription;
    onConnectionStateChange;
    candidates;

    constructor(stream, onTrack=(track)=>{}, sendCandidates=(candidates)=>{}, sendDescription=(description)=>{}, onConnectionStateChange=(state)=>{}){
        this.stream = stream;
        this.pc = new RTCPeerConnection(
            {
                offerToReceiveVideo: 1,
                offerToReceiveAudio: 0,
                iceServers: [
                    {
                        urls: 'stun:stun.l.google.com:19302' //google公開のstunサーバー 
                    }
                ]
            }
        );


        this.sendCandidates = sendCandidates;
        this.sendDescription = sendDescription;
        this.onConnectionStateChange = onConnectionStateChange;
        this.candidates=new Array();

        //add stream and create offer 
        let sendStream=new MediaStream(); //if both sender and receiver stream is null, not connected
        this.stream?.getTracks().forEach( (track) => {
            this.pc.addTrack(track, sendStream);
            console.debug("add track to stream", track, stream)
        });

        //log state change
        this.pc.oniceconnectionstatechange = ( (e) => {
            console.debug("iceConnectionState changed: ", this.pc.iceConnectionState)
            this.onConnectionStateChange(this.pc.iceConnectionState)
        });

        //when receive remote track (media streamを受け取った場合。データチャネルは別。)
        this.pc.ontrack = function (event) {
            onTrack(event.track);
        }
        
        //ice candidate info 
        this.pc.onicecandidate = ((event) => {
            if (event.candidate === null) {
                console.debug("null candidate", event);
                this.sendCandidates( this.candidates );
            }else{    
                console.debug("onIceCandidate", event.candidate);
                this.pc.addIceCandidate(event.candidate);
                this.candidates.push(event.candidate);
                console.debug("MY CANDIDATES", this.candidates);
            }
        });
    }
    

    
}

export class Sender extends baseWebRTC{


    offer = async () => {
        const offer = await this.pc.createOffer().catch((e)=>{
            console.error(e);
        });
        console.debug("createdOffer",offer); 
        this.pc.setLocalDescription(offer) //自身のsdpを登録 
        this.sendDescription(offer);
    }

    onReceiveRemoteDescription = (description) => {
        console.debug("remote description", description);
        this.pc.setRemoteDescription(description);
        //this.sendCandidates( this.candidates );
    };

    //onReceiveCandidates: sender first send candidates 
    onReceiveRemoteCandidates = (candidates) => {
        console.debug("CANDIDATES", candidates);
        if(candidates==null){
            console.error("NULL CANDIDATES");
            return;
        }
        candidates.forEach((candidate)=>{
            if(candidate===null || candidate.candidate==null){
                console.debug("null candidate")
            }else{
                this.pc.addIceCandidate(candidate).catch((e)=>{
                    console.error("sender addCandidate has caused error", e);
                })
            }
        });
    }
}

export class Receiver extends baseWebRTC{

    onReceiveRemoteDescription = async (description) => {
        console.debug("remote description", description);
        this.pc.setRemoteDescription(description);

        const answer = await this.pc.createAnswer().catch((e)=>{
            console.error(e);
        });
        this.pc.setLocalDescription(answer);
        this.sendDescription(answer);
    };

    //onReceiveCandidates: receiver receive candidates from server, and then return local candidates 
    onReceiveRemoteCandidates = (candidates) => {
        candidates.forEach((candidate)=>{
            if(candidate===null){
                console.debug("null candidate")
            }else{
                this.pc.addIceCandidate(candidate).catch((e)=>{
                    console.error("sender addCandidate has caused error", e);
                })
            }
        });

        //this.sendCandidates( this.candidates );
    }
}
