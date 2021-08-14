package middleware

import (
	. "api/utils"

	"github.com/gofiber/fiber/v2"
)

func CheckNotAuthenticated(c *fiber.Ctx) error {
	authToken := string(c.Request().Header.Peek("Authentication"))
	_, err := RedisGet(authToken)

	if err != nil {
		return c.Next()
	}

	return c.Status(403).JSON(&fiber.Map{
		"success": false,
		"message": "You can not be authenticated in this route!",
	})
}
