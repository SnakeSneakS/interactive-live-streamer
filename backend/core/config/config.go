package config

import (
	"encoding/json"
	"os"

	"github.com/labstack/gommon/log"
)

const (
	env_port          = "PORT"
	env_allowed_hosts = "ALLOWED_HOSTS"
	env_is_debug_mode = "IS_DEBUG_MODE"

	WS_MSG_CHAN_SIZE = 64
)

var (
	PORT          string
	ALLOWED_HOSTS []string
	IS_DEBUG_MODE bool
)

func LoadEnvValues() {
	PORT = os.Getenv(env_port)
	ALLOWED_HOSTS = make([]string, 0)
	IS_DEBUG_MODE = os.Getenv(env_is_debug_mode) == "true"
	allowedHostsString := os.Getenv(env_allowed_hosts)
	if err := json.Unmarshal([]byte(allowedHostsString), &ALLOWED_HOSTS); err != nil {
		log.Panicf("Invalid environmental variable: %s", err)
	}
}
