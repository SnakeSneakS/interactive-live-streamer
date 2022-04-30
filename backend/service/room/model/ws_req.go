package model

//Req: Client -> Server

const (
	UserUpdateReqType WsReqType = iota
	RtcSenderOfferReqType
	RtcSenderCandidatesReqType
	RtcReceiverAnswerReqType
	RtcReceiverCandidatesReqType
)

type WsReqType int

type Req struct {
	Type WsReqType   `json:"type"`
	Data interface{} `json:"data"`
}

type UserUpdateReq struct {
	Username string `json:"username"`
}

type RtcSenderOfferReq struct {
	FromUserID uint32 `json:"from_user_id"`
	ToUserID   uint32 `json:"to_user_id"`
	Offer      string `json:"offer"`
}

type RtcSenderCandidatesReq struct {
	FromUserID uint32 `json:"from_user_id"`
	ToUserID   uint32 `json:"to_user_id"`
	Candidates string `json:"candidates"`
}

type RtcReceiverAnswerReq struct {
	FromUserID uint32 `json:"from_user_id"`
	ToUserID   uint32 `json:"to_user_id"`
	Offer      string `json:"offer"`
}

type RtcReceiverCandidatesReq struct {
	FromUserID uint32 `json:"from_user_id"`
	ToUserID   uint32 `json:"to_user_id"`
	Candidates string `json:"candidates"`
}
