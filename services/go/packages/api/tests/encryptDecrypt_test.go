package tests

import (
	. "api/utils"
	"testing"
)

func TestEncryptDecrypt(t *testing.T) {
	password := "supercoolandsecurepassword"
	text := "super secret text i need to store securely."

	encryptedText, iv := Encrypt(text, password)
	decryptedText, err := Decrypt(password, encryptedText, iv)

	if err != nil {
		t.Errorf("Text was incorrect! I really wanted %s, but ended up getting %s", text, decryptedText)
	}
}
