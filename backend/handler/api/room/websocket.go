package room

import (
	"net"
	"net/http"
	"net/url"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/labstack/gommon/log"
	"github.com/snakesneaks/interactive-live-streamer/backend/core/config"
	"github.com/snakesneaks/interactive-live-streamer/backend/service"
	"github.com/snakesneaks/interactive-live-streamer/backend/service/room/model"
)

const (
	socketBufferSize  = 1024
	messageBufferSize = 512
)

func WsCreateRoom(w http.ResponseWriter, r *http.Request) {
	//core.AllowCORS(w)
	log.Printf("Create Room Request!!")

	//socket connection
	socket, err := newMyUpgrader().Upgrade(w, r, nil)
	if err != nil {
		log.Error(err)
		w.Write([]byte(err.Error()))
		return
	}

	//create user
	u := model.NewUser("admin", socket)
	socket.WriteJSON(model.UserInfoRes{User: u})

	//create and add room
	createdRoom := service.RoomManager.AddRoom(u.ID)
	createdRoom.AddUser(u)
	socket.WriteJSON(model.RoomInfoRes{Room: createdRoom})

	//handle message
	go startReadMessage(socket, u)

}

func WsJoinRoom(w http.ResponseWriter, r *http.Request) {
	//core.AllowCORS(w)
	roomid := mux.Vars(r)["roomid"]
	log.Printf("Join Room Request!! roomID=%s", roomid)

	//Room ID check
	joinRoom, ok := service.RoomManager.Rooms[roomid]
	if !ok {
		http.NotFound(w, r)
		return
	}

	//socket connection
	socket, err := newMyUpgrader().Upgrade(w, r, nil)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}

	//create user
	u := model.NewUser("listener", socket)
	socket.WriteJSON(model.UserInfoRes{User: u})

	//add User to room
	joinRoom.AddUser(u)
	socket.WriteJSON(model.RoomInfoRes{Room: joinRoom})

	//handle message
	go startReadMessage(socket, u)
}

//startReadMessage
func startReadMessage(socket *websocket.Conn, u *model.User) {
	defer func() {
		close(u.WsMsgChan)
	}()

	for {
		_, b, err := socket.ReadMessage()
		if err != nil {
			log.Error(err)
			break
		}
		u.WsMsgChan <- b
	}
}

//websocket upgrader
func newMyUpgrader() *websocket.Upgrader {
	var upgrader = &websocket.Upgrader{
		ReadBufferSize:  socketBufferSize,
		WriteBufferSize: socketBufferSize,
		CheckOrigin: func(r *http.Request) bool {
			bool := false
			originHost := getOriginHost(r)

			//host check
			for _, host := range config.ALLOWED_HOSTS {
				if host == "*" || host == originHost {
					bool = true
					break
				}
				continue
			}
			return bool
		},
	}
	return upgrader
}

func getOriginHost(r *http.Request) string {
	originURL, err1 := url.Parse(r.Header.Get("Origin"))
	if err1 != nil {
		log.Panic(err1)
	}
	originHost, _, err2 := net.SplitHostPort(originURL.Host)
	if err2 != nil {
		log.Panic(err2)
	}
	return originHost
}
