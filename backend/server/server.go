package server

import (
	"net/http"
	"os"

	"github.com/snakesneaks/interactive-live-streamer/backend/handler"
)

func Run() {
	port := os.Getenv("PORT")
	http.ListenAndServe(port, handler.NewHandler())
}
