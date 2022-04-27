package live

import (
	"net/http"

	"github.com/gorilla/mux"
)

type Handler struct {
	r *mux.Router
}

func NewHandler() *Handler {
	h := Handler{
		r: mux.NewRouter(),
	}

	return &h
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	h.r.ServeHTTP(w, r)
}
