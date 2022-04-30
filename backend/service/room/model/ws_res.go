package model

import "github.com/snakesneaks/snakesneaks-go-game-server-test/go-game-server/service/model"

//Res: Server -> Client

const (
	UserInfoResType WsResType = iota
	RoomInfoResType

	RtcSenderOfferResType
	RtcSenderCandidatesResType
	RtcReceiverAnswerResType
	RtcReceiverCandidatesResType
)

type WsResType int

type Res struct {
	Type WsResType `json:"type"`
	Data []byte    `json:"data"`
}

type UserUpdateRes struct {
	Username string `json:"username"`
}

type UserInfoRes struct {
	User *model.User `json:"user"`
}

type RoomInfoRes struct {
	Room *Room `json:"room"`
}

type RtcSenderOfferRes struct {
	FromUserID uint32 `json:"from_user_id"`
	ToUserID   uint32 `json:"to_user_id"`
	Offer      string `json:"offer"`
}

type RtcSenderCandidatesRes struct {
	FromUserID uint32 `json:"from_user_id"`
	ToUserID   uint32 `json:"to_user_id"`
	Candidates string `json:"candidates"`
}

type RtcReceiverAnswerRes struct {
	FromUserID uint32 `json:"from_user_id"`
	ToUserID   uint32 `json:"to_user_id"`
	Offer      string `json:"offer"`
}

type RtcReceiverCandidatesRes struct {
	FromUserID uint32 `json:"from_user_id"`
	ToUserID   uint32 `json:"to_user_id"`
	Candidates string `json:"candidates"`
}
