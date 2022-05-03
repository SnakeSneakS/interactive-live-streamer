package handler

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/labstack/gommon/log"
	"github.com/snakesneaks/interactive-live-streamer/backend/handler/api"
)

type Handler struct {
	r *mux.Router
}

func NewHandler() *Handler {
	h := &Handler{
		r: mux.NewRouter(),
	}

	h.r.Handle("/api{?:/?.*}", http.StripPrefix("/api", api.NewHandler()))

	h.r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/", http.StatusPermanentRedirect)
	})

	return h
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Debugf("Handle %s", r.URL)
	h.r.ServeHTTP(w, r)
}
