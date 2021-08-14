package middleware

import (
	. "api/utils"

	"github.com/gofiber/fiber/v2"
)

func CheckAuthenticated(c *fiber.Ctx) error {
	authToken := string(c.Request().Header.Peek("Authentication"))
	_, ok := RedisGet(authToken)

	if !ok {
		return c.Status(403).JSON(&fiber.Map{
			"success": false,
			"message": "You are not authenticated or authenticated correctly!",
		})
	}

	return c.Next()
}
