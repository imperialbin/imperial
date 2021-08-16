package utils

import "crypto/sha256"

func NewSHA256(text []byte) []byte {
	hash := sha256.Sum256(text)
	return hash[:]
}
