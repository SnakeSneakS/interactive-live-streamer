package core

import (
	"math/rand"

	"github.com/google/uuid"
	"github.com/labstack/gommon/log"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

//GenerateRandomString generate string
func GenerateRandomString(length int) string {
	b := make([]rune, 0)
	len := len(letters)
	for i := range b {
		r := rand.Intn(len)
		b[i] = letters[r]
	}
	return string(b)
}

//GenerateRandomUint32 generate random uint32 value
func GenerateRandomUint32() uint32 {
	uuid, err := uuid.NewRandom()
	if err != nil {
		log.Error(err)
	}
	return uuid.ID()
}
