package config

import (
	"encoding/json"
	"os"

	"github.com/labstack/gommon/log"
)

const (
	env_port          = "PORT"
	env_allowed_hosts = "ALLOWED_HOSTS"
)

var (
	PORT          string
	ALLOWED_HOSTS []string
)

func LoadEnvValues() {
	PORT = os.Getenv(env_port)
	ALLOWED_HOSTS = make([]string, 0)
	allowedHostsString := os.Getenv(env_allowed_hosts)
	if err := json.Unmarshal([]byte(allowedHostsString), &ALLOWED_HOSTS); err != nil {
		log.Panicf("Invalid environmental variable: %s", err)
	}
}
