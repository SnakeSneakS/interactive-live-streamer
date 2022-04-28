package room

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/labstack/gommon/log"
	"github.com/snakesneaks/interactive-live-streamer/backend/service"
	"github.com/snakesneaks/interactive-live-streamer/backend/service/manager/room"
)

const (
	socketBufferSize  = 1024
	messageBufferSize = 512
)

var upgrader = &websocket.Upgrader{ReadBufferSize: socketBufferSize, WriteBufferSize: socketBufferSize}

func WsCreateRoom(w http.ResponseWriter, r *http.Request) {
	//core.AllowCORS(w)
	log.Printf("Create Room Request!!\n")

	//socket connection
	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}

	//create user
	u := room.NewUser("admin", socket)
	socket.WriteJSON(u)

	room := service.RoomManager.AddRoom(u.ID)
	socket.WriteJSON(room)

	socket.Close()
}

func WsJoinRoom(w http.ResponseWriter, r *http.Request) {
	//core.AllowCORS(w)
	roomid := mux.Vars(r)["roomid"]
	log.Printf("Join Room Request!! roomID=%s", roomid)

	//Room ID check

	//socket connection
	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}
	socket.Close()
}
