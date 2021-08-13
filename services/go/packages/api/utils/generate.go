package utils

import (
	"math/rand"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func GenerateString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func GenerateJWT(userId string, expiration int) string {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    userId,
		ExpiresAt: time.Now().Add(time.Hour * time.Duration(expiration) * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		print(err.Error())
	}

	return token
}
