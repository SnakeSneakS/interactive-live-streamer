package room

import (
	"fmt"
	"time"

	"github.com/gorilla/websocket"
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
	AccessID    string           `json:"acces_id"`      //accessするために使う(url)
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
	go func() {
		for r.State == IsRun {
			for k, u := range r.Users {
				log.Printf("DEBUG: handling user, userID: %d, userName: %s\n", k, u.Username)
				t, b, e := u.Conn.ReadMessage()
				if e != nil {
					if t == websocket.TextMessage {
						log.Printf("Message: %s\n", string(b))
					}
				} else {
					fmt.Printf("e: %v\n", e)
				}
			}
		}
	}()
}

func (r *Room) Delete() {
	r.State = IsEnd
	for _, u := range r.Users {
		r.DeleteUser(u)
	}
}

func (r *Room) AddUser(u *User) {
	r.Users[u.ID] = u
}

func (r *Room) DeleteUser(u *User) {
	if _, ok := r.Users[u.ID]; !ok {
		log.Errorf("Tried to delete user, userID=%d, but user not found in room roomID=%s", u.ID, r.ID)
	}
	u.Delete()
	delete(r.Users, u.ID)
}

func (r *Room) Publish(message string) {
	for _, user := range r.Users {
		user.Conn.WriteMessage(websocket.TextMessage, []byte(message))
	}
}
