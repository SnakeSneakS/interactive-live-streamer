package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/snakesneaks/interactive-live-streamer/backend/core/config"
	"github.com/snakesneaks/interactive-live-streamer/backend/handler"
)

func Run() {
	config.LoadEnvValues()

	port := config.PORT

	log.Printf("Started server on port %s\n", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), handler.NewHandler()); err != nil {
		log.Fatal(err)
	}
}
