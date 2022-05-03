package model

import (
	"github.com/gorilla/websocket"
	"github.com/labstack/gommon/log"
	"github.com/snakesneaks/interactive-live-streamer/backend/core"
	"github.com/snakesneaks/interactive-live-streamer/backend/core/config"
)

type User struct {
	ID        uint32          `json:"id"`
	Username  string          `json:"username"`
	conn      *websocket.Conn `json:"-"`
	WsMsgChan chan []byte     `json:"-"` //WebSocket Message Channel
	isClosed  bool
}

func NewUser(username string, conn *websocket.Conn) *User {
	u := &User{
		ID:        core.GenerateRandomUint32(), //TODO: make it **definitely unique** value
		Username:  username,
		conn:      conn,
		WsMsgChan: make(chan []byte, config.WS_MSG_CHAN_SIZE),
		isClosed:  false,
	}
	return u
}

func (u *User) Send(res WsRes) error {
	err := u.conn.WriteJSON(res)
	return err
}

func (u *User) Delete() {
	log.Debug("Delete User!", u)
	u.CloseConn()
}

func (u *User) CloseConn() {
	if !u.isClosed {
		u.isClosed = true
		u.conn.Close()
		close(u.WsMsgChan)
	}
}
