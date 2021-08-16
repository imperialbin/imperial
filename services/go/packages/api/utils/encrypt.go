package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
)

func Encrypt(text, password string) (encryptedText, initVector string) {
	key := []byte(password)
	hashedPassword := NewSHA256(key) // We're creating a new SHA because it MUST be 32 characters for the thingy that goes beep boop

	block, err := aes.NewCipher(hashedPassword)

	if err != nil {
		println("mate")
	}

	cipherText := make([]byte, aes.BlockSize+len(text))

	iv := cipherText[:aes.BlockSize]

	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		fmt.Printf("wtf")
	}

	encrypt := cipher.NewCFBEncrypter(block, iv)
	encrypt.XORKeyStream(cipherText[aes.BlockSize:], []byte(text))

	return hex.EncodeToString(cipherText), hex.EncodeToString(iv)
}
