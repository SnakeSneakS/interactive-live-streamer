package server

import (
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/labstack/gommon/log"
	"github.com/snakesneaks/interactive-live-streamer/backend/core/config"
	"github.com/snakesneaks/interactive-live-streamer/backend/handler"
)

func setup() {
	//rand seed setup
	rand.Seed(time.Now().UnixNano())

	//env value setup
	config.LoadEnvValues()

	//log setup
	//refer to: https://github.com/labstack/gommon/blob/64116baad496a231ad30992d77a75aa524fcc571/log/log.go#L52
	//example:  defaultHeader = `{"time":"${time_rfc3339_nano}","level":"${level}","prefix":"${prefix}",` + `"file":"${short_file}","line":"${line}"}`
	log.SetHeader("${time_rfc3339_nano}: [${level}]")
	if config.IS_DEBUG_MODE {
		log.SetLevel(log.DEBUG)
	} else {
		log.SetLevel(log.INFO)
	}
	log.SetOutput(os.Stdout)
	log.SetPrefix("")
}

func Run() {
	setup()

	log.Infof("Started server on port %s", config.PORT)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", config.PORT), handler.NewHandler()); err != nil {
		log.Fatalf("Failed to start server! %s", err)
	}
}
