package server

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/snakesneaks/interactive-live-streamer/backend/handler"
)

const (
	ENV_PORT = "PORT"
)

func Run() {
	port := os.Getenv(ENV_PORT)

	log.Printf("Started server on port %s\n", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), handler.NewHandler()); err != nil {
		log.Fatal(err)
	}
}
