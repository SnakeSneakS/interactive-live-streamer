package handler

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/snakesneaks/interactive-live-streamer/backend/handler/live"
)

type Handler struct {
	r *mux.Router
}

func NewHandler() *Handler {
	h := &Handler{
		r: mux.NewRouter(),
	}
	h.r.Handle("/live", http.StripPrefix("/live{?:/?.*}", live.NewHandler()))

	return h
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handle %s\n", r.URL)
	h.r.ServeHTTP(w, r)
}
