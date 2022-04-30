package room

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/labstack/gommon/log"
)

type Handler struct {
	r *mux.Router
}

func NewHandler() *Handler {
	h := Handler{
		r: mux.NewRouter(),
	}
	h.r.HandleFunc("/create{?:/?.*}", createRoom) //.Methods(http.MethodConnect)
	h.r.HandleFunc("/join/{roomid}", joinRoom)    //or /join/{key}
	h.r.HandleFunc("/{?:/?.*}", handleHome)

	return &h
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.r.ServeHTTP(w, r)
}

func handleHome(w http.ResponseWriter, r *http.Request) {
	log.Print("Handle Room Home !!!")
	w.Write([]byte(`
	<html>
	<head>
		<title>room</title>
	</head>
	<body>
		<h1>Usage: ./create or ./join/{roomid} through websocket.</h1>
	</body>
	</html>
	`))
}

//create room as owner
func createRoom(w http.ResponseWriter, r *http.Request) {
	WsCreateRoom(w, r)
}

//join room as guest
func joinRoom(w http.ResponseWriter, r *http.Request) {
	WsJoinRoom(w, r)
}
