package model

import "github.com/pion/webrtc/v3"

//Res: Server -> Client

const (
	UserInfoResType WsResType = iota
	RoomInfoResType
	RoomEnteredResType

	RtcSenderOfferResType
	RtcSenderCandidatesResType
	RtcReceiverAnswerResType
	RtcReceiverCandidatesResType
)

type WsResType int

type WsRes struct {
	//UserID uint32      `json:"user_id"` //message from whom
	Type WsResType   `json:"type"`
	Data interface{} `json:"data"`
}

type UserUpdateRes struct {
	Username string `json:"username"`
}

type UserInfoRes struct {
	User *User `json:"user"`
}

//when newly entered room
type RoomEnteredRes struct {
	Room *Room `json:"room"`
}

//when you are already in room & new user has enterd to room
type RoomInfoRes struct {
	Room *Room `json:"room"`
}

type RtcSenderOfferRes struct {
	FromUserID  uint32                    `json:"from_user_id"`
	Description webrtc.SessionDescription `json:"description"`
}

type RtcSenderCandidatesRes struct {
	FromUserID uint32                    `json:"from_user_id"`
	Candidates []webrtc.ICECandidateInit `json:"candidates"`
}

type RtcReceiverAnswerRes struct {
	FromUserID  uint32                    `json:"from_user_id"`
	Description webrtc.SessionDescription `json:"description"`
}

type RtcReceiverCandidatesRes struct {
	FromUserID uint32                    `json:"from_user_id"`
	Candidates []webrtc.ICECandidateInit `json:"candidates"`
}

type RoomMessageRes struct {
	Message string `json:"message"`
}
