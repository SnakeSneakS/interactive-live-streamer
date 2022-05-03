package room

import (
	"time"

	"github.com/labstack/gommon/log"
	"github.com/snakesneaks/interactive-live-streamer/backend/core"
	"github.com/snakesneaks/interactive-live-streamer/backend/service/room/model"
)

const (
	roomPatrolDuration = 10 * time.Minute //10 minutes
	roomValidDuration  = 6 * time.Hour    //1 hour
)

type RoomManager struct {
	isPatroling bool
	Rooms       map[string]*model.Room
}

func NewRoomManager() *RoomManager {
	r := &RoomManager{
		isPatroling: false,
		Rooms:       make(map[string]*model.Room, 0),
	}
	r.startPatrol()
	return r
}

func (r *RoomManager) AddRoom(adminUserID uint32) *model.Room {
	room := model.NewRoom(adminUserID)
	for {
		if _, ok := r.Rooms[room.AccessID]; !ok {
			break
		}
		log.Warn("Duplicated Room ID", room.AccessID)
		room.AccessID = core.GenerateRandomString(model.LengthRoomID)
	}
	r.Rooms[room.AccessID] = room
	return room
}

func (r *RoomManager) DeleteRoom(roomID string) {
	if _, ok := r.Rooms[roomID]; !ok {
		log.Errorf("Tried to delete room, roomID=%s, but room not found!", roomID)
		return
	}
	r.Rooms[roomID].Delete()
	delete(r.Rooms, roomID)
}

func (r *RoomManager) AddUser(roomID string, u *model.User) {
	r.Rooms[roomID].AddUser(u)
}

func (r *RoomManager) DeleteUser(roomID string, u *model.User) {
	r.Rooms[roomID].DeleteUser(u)
	if len(r.Rooms[roomID].Users) == 0 {
		r.DeleteRoom(roomID)
	}
}

//func (r *RoomManager) DeleteUser(u *room.User) {}

func (r *RoomManager) startPatrol() {
	r.isPatroling = true
	go func() {
		for r.isPatroling {
			time.Sleep(roomPatrolDuration)
			t := time.Now()
			for roomID, room := range r.Rooms {
				if t.Sub(room.CreatedAt) > roomValidDuration {
					log.Errorf("Delete room because room life exceeded roomValidDuration: roomID=%s", roomID)
					r.DeleteRoom(roomID)
				}
			}
		}
	}()
}
