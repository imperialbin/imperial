package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/hex"
)

func Decrypt(password, encryptedText, initVector string) string {
	cipherText, _ := hex.DecodeString(encryptedText)
	hashedPassword := NewSHA256([]byte(password)) // We're making a new hash here to meet the 32 character limit, also because it wouldnt match the previously set password lol

	block, err := aes.NewCipher([]byte(hashedPassword))
	if err != nil {
		panic(err)
	}

	iv := cipherText[:aes.BlockSize]
	cipherText = cipherText[aes.BlockSize:]

	decrypt := cipher.NewCFBDecrypter(block, iv)
	decrypt.XORKeyStream(cipherText, cipherText)

	return string(cipherText)
}
