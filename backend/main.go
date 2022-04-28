package main

import (
	"math/rand"
	"time"

	"github.com/snakesneaks/interactive-live-streamer/backend/server"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	server.Run()
}
