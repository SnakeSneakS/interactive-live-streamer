package handler

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/labstack/gommon/log"
	"github.com/snakesneaks/interactive-live-streamer/backend/handler/room"
)

type Handler struct {
	r *mux.Router
}

func NewHandler() *Handler {
	h := &Handler{
		r: mux.NewRouter(),
	}

	h.r.Handle("/room{?:/?.*}", http.StripPrefix("/room", room.NewHandler()))

	h.r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/", http.StatusPermanentRedirect)
	})

	return h
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handle %s", r.URL)
	h.r.ServeHTTP(w, r)
}
