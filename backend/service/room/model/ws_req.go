package model

import "github.com/pion/webrtc/v3"

//Req: Client -> Server

const (
	UserUpdateReqType WsReqType = iota
	RtcSenderOfferReqType
	RtcSenderCandidatesReqType
	RtcReceiverAnswerReqType
	RtcReceiverCandidatesReqType
)

type WsReqType int

type WsReq struct {
	Type WsReqType   `json:"type"`
	Data interface{} `json:"data"`
}

type UserUpdateReq struct {
	Username string `json:"username"`
}

type RtcSenderOfferReq struct {
	ToUserID    uint32                    `json:"to_user_id"`
	Description webrtc.SessionDescription `json:"description"`
}

type RtcSenderCandidatesReq struct {
	ToUserID   uint32                    `json:"to_user_id"`
	Candidates []webrtc.ICECandidateInit `json:"candidates"`
}

type RtcReceiverAnswerReq struct {
	ToUserID    uint32                    `json:"to_user_id"`
	Description webrtc.SessionDescription `json:"description"`
}

type RtcReceiverCandidatesReq struct {
	ToUserID   uint32                    `json:"to_user_id"`
	Candidates []webrtc.ICECandidateInit `json:"candidates"`
}

type RoomMessageReq struct {
	Message string `json:"message"`
}
