package utils

import (
	"crypto/rand"
	"encoding/base64"
	"math/big"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

func GenerateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		return nil, err
	}

	return b, nil
}

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-"

func GenerateRandomString(n int) (string, error) {
	ret := make([]byte, n)
	for i := 0; i < n; i++ {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(letterBytes))))
		if err != nil {
			return "", err
		}
		ret[i] = letterBytes[num.Int64()]
	}

	return string(ret), nil
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

func GenerateSessionToken() (string, error) {
	token, err := GenerateRandomBytes(128)
	return base64.URLEncoding.EncodeToString(token), err
}
