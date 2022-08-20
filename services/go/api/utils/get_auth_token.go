package utils

import (
	"github.com/gofiber/fiber/v2"
)

func GetAuthToken(c *fiber.Ctx) string {
	var token string

	if len(c.Cookies("IMPERIAL-AUTH")) > 1 {
		token = c.Cookies("IMPERIAL-AUTH")
	} else {
		token = c.Get("Authorization")
	}

	return token
}
