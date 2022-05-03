package model

import (
	"encoding/json"
	"time"

	"github.com/labstack/gommon/log"
	"github.com/snakesneaks/interactive-live-streamer/backend/core"
)

type RoomState int

const (
	IsReady RoomState = iota //動く前
	IsRun                    //動いているとき
	IsEnd                    //動き終わったとき
)

const (
	LengthRoomID = 64
)

type Room struct {
	ID          uint32           `json:"-"`
	AccessID    string           `json:"access_id"`     //accessするために使う(url)
	AdminUserID uint32           `json:"admin_user_id"` //roomを作ったUser=AdminUser
	CreatedAt   time.Time        `json:"-"`
	State       RoomState        `json:"-"`
	Users       map[uint32]*User `json:"users"`
}

func NewRoom(adminUserID uint32) *Room {
	r := &Room{
		ID:          core.GenerateRandomUint32(),
		AccessID:    core.GenerateRandomString(LengthRoomID),
		AdminUserID: adminUserID,
		CreatedAt:   time.Now(),
		State:       IsReady,
		Users:       make(map[uint32]*User, 0),
	}

	r.start()

	return r
}

func (r *Room) start() {
	r.State = IsRun
}

func (r *Room) Delete() {
	r.State = IsEnd
	for _, u := range r.Users {
		r.DeleteUser(u)
	}
	log.Debug("Delete Room!", r)
}

func (r *Room) AddUser(u *User) {
	r.Users[u.ID] = u
	go r.startReadUserMessage(u)

	r.Publish(
		WsRes{
			Type: RoomInfoResType,
			Data: RoomInfoRes{
				Room: r,
			},
		},
	)
}

func (r *Room) DeleteUser(u *User) {
	if _, ok := r.Users[u.ID]; !ok {
		log.Errorf("Tried to delete user, userID=%d, but user not found in room roomID=%s", u.ID, r.ID)
	}
	u.Delete()
	delete(r.Users, u.ID)
	r.Publish(
		WsRes{
			Type: RoomInfoResType,
			Data: RoomInfoRes{r},
		},
	)

	if len(r.Users) == 0 {
		r.Delete()
	}
}

func (r *Room) SendTo(res WsRes, userID uint32) {
	u, ok := r.Users[userID]
	if !ok {
		log.Error("User not found! id", userID)
		return
	}
	u.Send(res)
}

func (r *Room) Publish(res WsRes) error {
	var err error
	for _, user := range r.Users {
		if e := user.Send(res); e != nil {
			err = e
		}
	}
	return err
}

//read websocket request
func (r *Room) startReadUserMessage(u *User) {
	for {
		b, ok := <-u.WsMsgChan

		if !ok {
			r.DeleteUser(u)
			break
		}

		var req WsReq
		if err := json.Unmarshal(b, &req); err != nil {
			log.Errorf("message: %s", string(b))
			log.Error(err)
		}
		log.Debug("id & websocket message", u.ID, string(b))
		r.handleUserReq(&req, u.ID)
	}
}

//handle websocket request
func (r *Room) handleUserReq(req *WsReq, userID uint32) {

	/*
		//こういう書き方もあるのでこういう書き方でもいいかもしれない
			switch req.Data.(type) {
			case UserUpdateReq:
				break
			}
	*/

	//TODO: This interface->string is somehow redandunt, which should be fixed
	mapStringData, ok := req.Data.(map[string]interface{})
	if !ok {
		log.Error("Failed to convert data type of websocket request data")
		return
	}

	dataBytes, err := json.Marshal(mapStringData)
	if err != nil {
		log.Error("Failed to marshar request data")
		return
	}
	log.Debug("dataString ", string(dataBytes))

	switch req.Type {
	case UserUpdateReqType:
		var data UserUpdateReq
		if err := json.Unmarshal(dataBytes, &data); err != nil {
			log.Error("failed to convert request data type", "UserUpdateReq", err)
		}
		log.Debug("TODO: update username", data)

	case RtcSenderOfferReqType:
		var data RtcSenderOfferReq
		if err := json.Unmarshal(dataBytes, &data); err != nil {
			log.Error("failed to convert request data type", "RtcSenderOfferReq", err)
		}

		log.Debug("rtc sender offer request", data)
		r.SendTo(
			WsRes{
				Type: RtcSenderOfferResType,
				Data: RtcSenderOfferRes{
					FromUserID:  userID,
					Description: data.Description,
				},
			},
			data.ToUserID,
		)

	case RtcSenderCandidatesReqType:
		var data RtcSenderCandidatesReq
		if err := json.Unmarshal(dataBytes, &data); err != nil {
			log.Error("failed to convert request data type", "RtcSenderCandidatesReq", err)
		}

		log.Debug("rtc sender candidates request", data)
		r.SendTo(
			WsRes{
				Type: RtcSenderCandidatesResType,
				Data: RtcSenderCandidatesRes{
					FromUserID: userID,
					Candidates: data.Candidates,
				},
			},
			data.ToUserID,
		)

	case RtcReceiverAnswerReqType:
		var data RtcReceiverAnswerReq
		if err := json.Unmarshal(dataBytes, &data); err != nil {
			log.Error("failed to convert request data type", "RtcReceiverAnswerReq", err)
		}

		log.Debug("rtc receiver answer request", data)
		r.SendTo(
			WsRes{
				Type: RtcReceiverAnswerResType,
				Data: RtcReceiverAnswerRes{
					FromUserID:  userID,
					Description: data.Description,
				},
			},
			data.ToUserID,
		)

	case RtcReceiverCandidatesReqType:
		var data RtcReceiverCandidatesReq
		if err := json.Unmarshal(dataBytes, &data); err != nil {
			log.Error("failed to convert request data type", "RtcReceiverCandidatesReq", err)
		}

		log.Debug("rtc receiver candidates request", data)
		r.SendTo(
			WsRes{
				Type: RtcReceiverCandidatesResType,
				Data: RtcReceiverCandidatesRes{
					FromUserID: userID,
					Candidates: data.Candidates,
				},
			},
			data.ToUserID,
		)

	default:
		log.Error("Unhandling request", req)
	}
}
