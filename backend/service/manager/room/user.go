package room

import (
	"github.com/gorilla/websocket"
	"github.com/snakesneaks/interactive-live-streamer/backend/core"
)

type User struct {
	ID       uint32          `json:"id"`
	Username string          `json:"username"`
	Conn     *websocket.Conn `json:"-"`
}

func NewUser(username string, conn *websocket.Conn) *User {
	u := &User{
		ID:       core.GenerateRandomUint32(), //TODO: make it **definitely unique** value
		Username: username,
		Conn:     conn,
	}
	return u
}

func (u *User) Delete() {
	u.Conn.Close()
}
